// requirements
const express = require('express')
const app = express()

// others
const stylus = require('stylus');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
var path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000
const oneDay = 1000 * 60 * 60 * 24;

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'ejs');

// setup middleware
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));

// parsing form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

//
// app.use(stylus.middleware({src: path.join(__dirname, '/public')}));
app.use(express.static(path.join(__dirname, '/public/')));


var indexRouter = require('./server/routes');
var projectRouter = require('./server/projects');

app.use('/', indexRouter);
app.use('/projects', projectRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})