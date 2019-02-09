const routes = require('express').Router();

const utils = require("../utils");

const videoManager = require("../videoManager");


function getVideosTemplateInformation(templateContext, request)
{
    var promises = [];

    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
    {
        promises.push(videoManager.getVideosForTemplate(templateContext, "private"));
    }
    else
    {
        templateContext["private"] = [];
    }

    promises.push(videoManager.getVideosForTemplate(templateContext, "public"));

    return Promise.all(promises);
}

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "videos.html", getVideosTemplateInformation)
});

module.exports = routes;