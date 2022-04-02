require('dotenv').config();
const debug = require('debug')('index');

const express = require('express');
const router = require('./app/router');
const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  debug(`Listening on ${port}`);
});