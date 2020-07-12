const express = require('express');
const path = require('path');
const logger = require('morgan');

const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));
