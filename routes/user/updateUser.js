const routes = require('express').Router();

const utils = require("../../utils");

const userUtils = require("../../user");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
    {
        var admin = false;
        userUtils.editUser(request.session.userID, request.body.username, request.body.password,admin);
        result.redirect('/user');
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

module.exports = routes;