const routes = require('express').Router();

const icon = require('./icon');
routes.use('/icon', icon);

const video = require('./video');
routes.use('/video', video);

const videos = require('./videos');
routes.use('/videos', videos);

const watch = require('./watch');
routes.use('/watch', watch);

const user = require('./user');
routes.use('/user', user);

const syss = require('./system');
routes.use('/system', syss);

const utils = require("../utils");


function getHomePageInformation(templateContext, request)
{
    templateContext.username = request.session.username;
}


routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "home.html", getHomePageInformation)
});


routes.get('*', (request, result) =>
{
    utils.printError(result, "Page not found.");
});

module.exports = routes;