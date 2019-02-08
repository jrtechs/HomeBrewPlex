const routes = require('express').Router();

const userUtils = require("../../user");

routes.post('/', (request, result) =>
{
    if(userUtils.checkLogin(request.body.username, request.body.password))
    {
        request.session.login = true;
        request.session.username = request.body.username;
        request.session.userID = userUtils.getID(request.body.username);
        request.session.API = userUtils.getAPIKEY(request.body.username);
        if(userUtils.isAdmin(request.body.username))
        {
            request.session.admin = true;
        }
    }
    result.redirect('/');
});

module.exports = routes;