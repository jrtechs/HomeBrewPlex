const routes = require('express').Router();

const icon = require('./icon');
routes.get('/icon', icon);

const video = require('./video');
routes.get('/video', video);

const videos = require('./videos');
routes.get('/videos', videos);

const watch = require('./watch');
routes.get('/watch', watch);

const user = require('./user');
routes.use('/user', user);


const utils = require("../utils");


function getHomePageInformation(templateContext, request)
{
    templateContext.username = request.session.username;
}


routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "home.html", getHomePageInformation)
});

module.exports = routes;