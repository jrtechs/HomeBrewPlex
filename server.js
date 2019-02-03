/** express app for routing */
const express = require("express");

/**session data for login and storing preferences*/
const session = require('express-session');

const fileIO = require('./fileIO');

const userUtils = require('./user.js');


const recursive = require('./recursiveTraversal');

const fs = require('fs');

const app = express();

app.use(express.urlencoded());
app.use(express.json());      // if needed


const CONFIG_FILE_NAME = "conf.json";
const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);

/**Initializes sessions for login */
app.use(session({ secret: config.sessionSecret, cookie: { maxAge: 6000000 }}));

/** Template engine */
const whiskers = require('whiskers');

var rootDir = '/home/jeff/public/Movies/';

function fetchInTemplate(templateContext, templateKey, filename)
{
    templateContext[templateKey] = fileIO.getFile(filename);
}

function renderHTML(request, result, templateFile, templateDependencyFunction)
{
    var templateContext = Object();
    var prom = [];

    prom.push(fileIO.getFile("./html/mainTemplate.html"));
    prom.push(fetchInTemplate(templateContext, "header", "./html/header.html"));
    prom.push(fetchInTemplate(templateContext, "footer", "./html/footer.html"));
    if(request.session.login === true)
    {
        templateContext.loggedIn = true;
        if(templateDependencyFunction !== null)
            prom.push(templateDependencyFunction(templateContext, request));
        prom.push(fetchInTemplate(templateContext, "main","./html/" + templateFile));
    }
    else
    {
        prom.push(fetchInTemplate(templateContext, "login","./html/login.html"));
    }

    Promise.all(prom).then(function(content)
    {
        result.write(whiskers.render(content[0], templateContext));
        result.end();
    });
}

function getUserInformation(templateContext, request)
{
    templateContext.users = config.users;
}

function getHomePageInformation(templateContext, request)
{
    templateContext.username = request.session.username;
}

app.get('/', (req, res) => renderHTML(req, res, "home.html", getHomePageInformation));
app.get('/users', (req, res) => renderHTML(req, res, "users.html", getUserInformation));

app.use(express.static('css'));
app.use(express.static('js'));


app.post('/login', function(request, result)
{
    if(userUtils.checkLogin(request.body.username, request.body.password, config))
    {
        request.session.login = true;
        request.session.username = request.body.username;
    }
    result.redirect('/');
});

var videos = null;

function getVideosTemplateInformation(templateContext, request)
{
    if(videos === null)
    {
        videos = [];
        return new Promise(function(resolve, reject)
        {
            recursive(rootDir, function (err, files)
            {
                console.log(files);
                files.forEach(file =>
                {
                    videos.push({name: file.replace(rootDir, ''), length: "n/a"});
                });
                templateContext.videos = videos;
                resolve();
            });
        })
    }
    else
    {
        templateContext.videos = videos;
    }
}

function getVideoTemplateInfo(templateContext, request)
{
    templateContext.videoURL = request.query.v;
}

app.get('/videos', (req, res) => renderHTML(req, res, "videos.html", getVideosTemplateInformation));
app.get('/watch', (req, res) => renderHTML(req, res, "watch.html", getVideoTemplateInfo));


app.get('/video/', function(request, result)
{
    if(request.session.login === true)
    {
        var videoID = request.query.v;
        const path = rootDir + videoID;

        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = request.headers.range;

        if (range)
        {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head =
                {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
            result.writeHead(206, head);
            file.pipe(result);
        }
        else
        {
            const head =
                {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };

            result.writeHead(200, head);
            fs.createReadStream(path).pipe(result);
        }
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});



app.post('/addUser', function(request, result)
{
    if(request.session.login === true)
    {
        userUtils.addUser(request.body.username, request.body.password, config);
        fileIO.writeJSONToFile(CONFIG_FILE_NAME, config);
        result.redirect('/users');
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});


app.post('/edituser', function(request, result)
{
    if(request.session.login === true)
    {
        userUtils.editUser(request.body.id, request.body.username, request.body.password, config);
        fileIO.writeJSONToFile(CONFIG_FILE_NAME, config);
        result.redirect('/users');
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});



app.post('/removeuser', function(request, result)
{
    if(request.session.login === true)
    {
        userUtils.removeUser(request.body.id, config);
        fileIO.writeJSONToFile(CONFIG_FILE_NAME, config);
        result.redirect('/users');
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});

app.post('/logout', function(request, result)
{
    request.session.login = false;
    result.redirect('/');
});


app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));