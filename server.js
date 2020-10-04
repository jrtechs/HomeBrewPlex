/** express app for routing */
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

/**session data for login and storing preferences*/
const session = require('express-session');

const app = express();

/**Initializes sessions for login */
app.use(session(
    { secret: process.env.SESSION_SECRET,
            cookie: { maxAge: 6000000 }}
    ));

app.use(express.urlencoded()); //for easy retrieval of post and get data
app.use(express.json());

app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('img'));

const routes = require('./routes');
app.use('/', routes);



app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}!`)
);