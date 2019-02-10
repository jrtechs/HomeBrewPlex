const routes = require('express').Router();

const utils = require("../../utils");

const configManager = require("../../configManager");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        configManager.updateSystem(request.body.baseURL,
            request.body.publicDirectory,
            request.body.privateDirectory);
        result.redirect('/system');
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

module.exports = routes;