const routes = require('express').Router();

const utils = require("../../utils");

const userUtils = require("../../user");

routes.get('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        userUtils.removeUser(request.body.id);
        result.redirect('/users');
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});

module.exports = routes;