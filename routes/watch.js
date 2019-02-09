const routes = require('express').Router();

const utils = require("../utils");

const configManager = require("../configManager");

function getVideoTemplateInfo(templateContext, request)
{
    templateContext.api = request.session.API;
    templateContext.serverURL = configManager.getServerURL();
    templateContext.videoURL = request.query.v.split(" ").join("%20");
}

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "watch.html", getVideoTemplateInfo)
});

module.exports = routes;