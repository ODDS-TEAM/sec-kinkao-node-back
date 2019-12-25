const express = require('express');
const app = express();

const helloRoutes = require('./api/Routes/hellloRoutes');

app.use('/hello', helloRoutes);

module.exports = app;
