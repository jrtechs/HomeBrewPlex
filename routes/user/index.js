const routes = require('express').Router();

const utils = require("../../utils");

const addUser = require('./addUser');
routes.use('/addUser', addUser);

const editUser = require('./edituser');
routes.use('/edituser', editUser);

const login = require('./login');
routes.use('/login', login);


const logout = require('./logout');
routes.use('/logout', logout);

const removeuser = require('./removeuser');
routes.use('/removeuser', removeuser);


const revokeAPI = require('./revokeAPI');
routes.use('/revokeAPI', revokeAPI);


const updateUser = require('./updateUser');
routes.use('/updateUser', updateUser);



const configLoader = require("../../configManager");

function getUserInformation(templateContext, request)
{
    templateContext.users = configLoader.getConfiguration().users;
    templateContext.apiKey = request.session.API;
    templateContext.id = request.session.userID;
    templateContext.username = request.session.username;
}

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "users.html", getUserInformation);
});

module.exports = routes;