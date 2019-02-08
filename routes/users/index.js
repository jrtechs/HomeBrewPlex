const routes = require('express').Router();

const utils = require("../../utils");

const addUser = require('./addUser');
routes.get('/addUser', addUser);

const editUser = require('./edituser');
routes.get('/edituser', editUser);

const login = require('./login');
routes.get('/login', login);


const logout = require('./logout');
routes.get('/logout', logout);

const removeuser = require('./removeuser');
routes.get('/removeuser', removeuser);


const revokeAPI = require('./revokeAPI');
routes.get('/revokeAPI', revokeAPI);


const updateUser = require('./updateUser');
routes.get('/updateUser', updateUser);

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "users.html", getUserInformation);
});

module.exports = routes;