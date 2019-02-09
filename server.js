/** express app for routing */
const express = require("express");

/**session data for login and storing preferences*/
const session = require('express-session');

const fileIO = require('./fileIO');

const userUtils = require('./user.js');

const configLoader = require('./configManager.js');

// const recursive = require('./recursiveTraversal');
//
// const filepreview = require('filepreview');

const fs = require('fs');





const app = express();

/**Initializes sessions for login */
app.use(session({ secret: configLoader.getConfiguration().sessionSecret, cookie: { maxAge: 6000000 }}));

app.use(express.urlencoded());
app.use(express.json());      // if needed

const routes = require('./routes');
app.use('/', routes);




// const CONFIG_FILE_NAME = "conf.json";
// const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);



// /** Template engine */
// const whiskers = require('whiskers');

// var rootDir = '/home/jeff/work/aaSchool/Algo/online Lectures/';

// var serverURL = "http://localhost:5000";

// function fetchInTemplate(templateContext, templateKey, filename)
// {
//     templateContext[templateKey] = fileIO.getFile(filename);
// }

// function renderHTML(request, result, templateFile, templateDependencyFunction)
// {
//     var templateContext = Object();
//     var prom = [];
//
//     prom.push(fileIO.getFile("./html/mainTemplate.html"));
//     prom.push(fetchInTemplate(templateContext, "header", "./html/header.html"));
//     prom.push(fetchInTemplate(templateContext, "footer", "./html/footer.html"));
//     if(checkPrivilege(request) >= PRIVILEGE.MEMBER)
//     {
//         templateContext.loggedIn = true;
//         if(checkPrivilege(request) === PRIVILEGE.ADMIN)
//             templateContext.admin = true;
//         if(templateDependencyFunction !== null)
//             prom.push(templateDependencyFunction(templateContext, request));
//         prom.push(fetchInTemplate(templateContext, "main","./html/" + templateFile));
//     }
//     else
//     {
//         prom.push(fetchInTemplate(templateContext, "login","./html/login.html"));
//     }
//
//     Promise.all(prom).then(function(content)
//     {
//         result.write(whiskers.render(content[0], templateContext));
//         result.end();
//     });
// }

// function getUserInformation(templateContext, request)
// {
//     templateContext.users = configLoader.getConfiguration().users;
//     templateContext.apiKey = request.session.API;
//     templateContext.id = request.session.userID;
//     templateContext.username = request.session.username;
// }

// function getHomePageInformation(templateContext, request)
// {
//     templateContext.username = request.session.username;
// }

// app.get('/', (req, res) => renderHTML(req, res, "home.html", getHomePageInformation));
// app.get('/users', (req, res) => renderHTML(req, res, "users.html", getUserInformation));

app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('img'));



// var videos = null;
//
// function getVideosTemplateInformation(templateContext, request)
// {
//     if(videos === null)
//     {
//         videos = [];
//         return new Promise(function(resolve, reject)
//         {
//             recursive(rootDir, function (err, files)
//             {
//                 console.log(files);
//                 files.forEach(file =>
//                 {
//                     var splitArray = file.split('/');
//                     var name = splitArray[splitArray.length -1];
//                     const icon = 'img/private/' + name + ".png";
//                     if (!fs.existsSync(icon))
//                     {
//                         filepreview.generate(file, icon, function(error) {
//                             if (error) {
//                                 return console.log(error);
//                             }
//                             console.log('File preview is located ' + icon);
//                         });
//                     }
//                     videos.push({name: file.replace(rootDir, ''), length: "n/a"});
//                 });
//                 templateContext.videos = videos;
//                 resolve();
//             });
//         })
//     }
//     else
//     {
//         templateContext.videos = videos;
//     }
// }

// function getVideoTemplateInfo(templateContext, request)
// {
//     templateContext.api = request.session.API;
//     templateContext.serverURL = serverURL;
//     templateContext.videoURL = request.query.v.split(" ").join("%20");
// }

// app.get('/videos', (req, res) => renderHTML(req, res, "videos.html", getVideosTemplateInformation));
// app.get('/watch', (req, res) => renderHTML(req, res, "watch.html", getVideoTemplateInfo));


// function isPublicVideo(videoURL)
// {
//     return false;
// }

//
// app.get('/icon/', function(request, result)
// {
//     try
//     {
//         const videoID = request.query.v;
//
//         const splitArray = videoID.split('/');
//         const name = splitArray[splitArray.length -1] + ".png";
//
//         var file="";
//
//         if(!isPublicVideo(videoID))
//         {
//             if(checkPrivilege(request) >= PRIVILEGE.MEMBER)
//             {
//                 file = fs.readFileSync("img/private/" + name);
//             }
//             else
//             {
//                 throw "Not logged in";
//             }
//         }
//         else
//         {
//             file = fs.readFileSync("img/public/" + name);
//         }
//
//         result.writeHead(200, {'Content-Type': 'image/png',
//             'Vary': 'Accept-Encoding'});
//         result.write(file);
//         result.end();
//     }
//     catch(error)
//     {
//         result.writeHead(404, {'Content-Type': 'text/html',
//             'Vary': 'Accept-Encoding'});
//         result.write("Nada");
//         result.end();
//     }
// });

// app.get('/video/', function(request, result)
// {
//     if(checkPrivilege(request) >= PRIVILEGE.MEMBER || userUtils.isValidAPI(request.query.api, config))
//     {
//         var videoID = request.query.v;
//         const path = rootDir + videoID;
//         const stat = fs.statSync(path);
//         const fileSize = stat.size;
//         const range = request.headers.range;
//
//         if (range)
//         {
//             const parts = range.replace(/bytes=/, "").split("-");
//             const start = parseInt(parts[0], 10);
//             const end = parts[1]
//                 ? parseInt(parts[1], 10)
//                 : fileSize-1;
//
//             const chunksize = (end-start)+1;
//             const file = fs.createReadStream(path, {start, end});
//             const head =
//                 {
//                     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//                     'Accept-Ranges': 'bytes',
//                     'Content-Length': chunksize,
//                     'Content-Type': 'video/mp4',
//                 };
//             result.writeHead(206, head);
//             file.pipe(result);
//         }
//         else
//         {
//             const head =
//                 {
//                     'Content-Length': fileSize,
//                     'Content-Type': 'video/mp4',
//                 };
//
//             result.writeHead(200, head);
//             fs.createReadStream(path).pipe(result);
//         }
//     }
//     else
//     {
//         console.log("invalid attempt to view video");
//         result.status(401);
//         result.send('None shall pass');
//     }
// });


app.listen(configLoader.getConfiguration().port, () => console.log(`App listening on port ${configLoader.getConfiguration().port}!`));