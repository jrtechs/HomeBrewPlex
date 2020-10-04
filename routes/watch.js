const routes = require('express').Router();

const utils = require("../utils");

const videoManager = require("../videoManager");

function getVideoTemplateInfo(templateContext, request)
{
    templateContext.api = request.session.API;
    templateContext.serverURL = process.env.SERVER_URL;
    templateContext.videoURL = request.query.v.split(" ").join("%20");

    if(utils.checkPrivilege(request) === utils.PRIVILEGE.NOBODY
        && !videoManager.isPublicVideo(request.query.v))
    {
        throw "Video either doesn't exist or you need to log in.";
    }
}

routes.get('/', (request, result) =>
{
    try
    {
        utils.renderHTML(request, result, "watch.html", getVideoTemplateInfo)
    }
    catch(error)
    {
        utils.printError(result, error);
    }

});

module.exports = routes;