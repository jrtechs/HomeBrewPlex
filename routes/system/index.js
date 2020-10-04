const routes = require('express').Router();

const utils = require("../../utils");

const indexVideos = require('./indexVideos');
routes.use('/indexVideos', indexVideos);

const updateSystem = require('./updateSystem');
routes.use('/updateSystem', updateSystem);

const configLoader = require("../../configManager");

const videoManager = require("../../videoManager");

function getSystemInformation(templateContext, request)
{
    templateContext.serverURL = process.env.SERVER_URL;
    templateContext.privateDir = process.env.PRIVATE_DIR;
    templateContext.publicDir = process.env.PUBLIC_DIR;
    templateContext.publicVideoCount = videoManager.getPublicVideoCount();
    templateContext.privateVideoCount = videoManager.getPrivateVideoCount();
    templateContext.userCount = configLoader.getUserCount();
}

routes.get('/', (request, result) =>
{
    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.ADMIN)
    {
        utils.renderHTML(request, result, "system.html", getSystemInformation);
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

routes.get('*', (request, result) =>
{
    utils.printError(result, "Page not found.");
});

module.exports = routes;