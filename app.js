require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const routes = require('./routes');

app.locals = {
    auths: {}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(routes);

// Template engine
app.set('view engine', 'pug');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));