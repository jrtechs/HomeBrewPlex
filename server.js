/** express app for routing */
const express = require("express");

/**session data for login and storing preferences*/
const session = require('express-session');

const fileIO = require('./fileIO');

const userUtils = require('./user.js');


const app = express();

app.use(express.urlencoded());
app.use(express.json());      // if needed


const CONFIG_FILE_NAME = "conf.json";
const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);

/**Initializes sessions for login */
app.use(session({ secret: config.sessionSecret, cookie: { maxAge: 6000000 }}));

/** Template engine */
const whiskers = require('whiskers');




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

app.get('/', (req, res) => renderHTML(req, res, "home.html", null));

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

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));