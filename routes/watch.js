const routes = require('express').Router();

const utils = require("../utils");

routes.get('/', (request, result) =>
{
    utils.renderHTML(req, res, "watch.html", getVideoTemplateInfo)
});

module.exports = routes;