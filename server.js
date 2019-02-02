/** express app for routing */
const express = require("express");

/**session data for login and storing preferences*/
const session = require('express-session');

const fileIO = require('./fileIO');


const app = express();


app.use(express.urlencoded());
app.use(express.json());      // if needed

/**Initializes sessions for login */
app.use(session({ secret: "sessionSecret", cookie: { maxAge: 6000000 }}));

/** Template engine */
const whiskers = require('whiskers');


const CONFIG_FILE_NAME = "conf.json";
const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);