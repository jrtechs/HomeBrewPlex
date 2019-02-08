const routes = require('express').Router();

const utils = require("../../utils");

const userUtils = require("../../user");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        userUtils.revokeAPI(request.body.username, config);
        request.session.API = userUtils.getAPIKEY(request.session.username);
    }
    else if (checkPrivilege(request) === PRIVILEGE.MEMBER)
    {
        userUtils.revokeAPI(request.session.username);
        request.session.API = userUtils.getAPIKEY(request.session.username);
    }
    result.redirect('/users');
});

module.exports = routes;