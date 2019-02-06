const routes = require('express').Router();

const utils = require("../../utils");

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "users.html", getUserInformation);
});

module.exports = routes;