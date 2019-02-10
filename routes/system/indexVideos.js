const routes = require('express').Router();

const utils = require("../../utils");

const videoManager = require("../../videoManager");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        videoManager.reIndexVideos();
        result.redirect('/system');
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

module.exports = routes;