'use strict';

const express = require('express');
const cors = require('cors');
const routerMiddleware = require('./routes/REST_routes');
const serverless = require("serverless-http");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

routerMiddleware(app);

module.exports = serverless(app);
