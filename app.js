require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

app.locals = {
    auths: {}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY]
}));
app.use(cookieParser());

app.use(routes);

// Template engine
app.set('view engine', 'pug');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));