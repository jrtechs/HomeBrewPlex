const routes = require('express').Router();

const utils = require("../../utils");

const userUtils = require("../../user");

routes.post('/', (request, result) =>
{
    if(utils.checkPrivilege(request) === utils.PRIVILEGE.ADMIN)
    {
        console.log("zat");
        var admin = false;
        if(request.body.admin === 'on')
            admin = true;
        userUtils.editUser(request.body.id, request.body.username, request.body.password,admin);
        result.redirect('/user');
    }
    else
    {
        result.status(401);
        result.send('None shall pass');
    }
});

module.exports = routes;