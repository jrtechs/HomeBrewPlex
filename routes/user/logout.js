const routes = require('express').Router();


routes.post('/', (request, result) =>
{
    request.session.login = false;
    request.session.admin = false;
    result.redirect('/');
});

module.exports = routes;