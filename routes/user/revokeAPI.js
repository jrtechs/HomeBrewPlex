const routes = require('express').Router();

const utils = require("../../utils");

const userUtils = require("../../user");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        userUtils.revokeAPI(request.body.username);
        request.session.API = userUtils.getAPIKEY(request.session.username);
    }
    else if (utils.checkPrivilege(request) === PRIVILEGE.MEMBER)
    {
        userUtils.revokeAPI(request.session.username);
        request.session.API = userUtils.getAPIKEY(request.session.username);
    }
    result.redirect('/user');
});

module.exports = routes;