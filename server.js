// connect to DB
require('./server/config/DBConnection');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const passport = require('passport');
require('./server/passport/passport')(passport);
// API file for interacting with MongoDB
const api = require('./server/routes/api')(passport);

const app = express();

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));


app.use(passport.initialize());
app.use(passport.session());
// API location
app.use('/api', api);


// Send all other requests to the HomePage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// // 500 internal server error handler
// app.use(function (err, req, res, next) {
//   if (err.statusCode === 404) {
//     return next();
//   }
//   res.status(500).json({
//     // Never leak the stack trace of the err if running in production mode
//     data: null,
//     err: null,
//     msg: '500 Internal Server Error'
//   });
// });

// 404 error handler
app.use(function (req, res) {
  res.status(404).json({
    data: null,
    err: null,
    msg: '404 Not Found'
  });
});

//Set Port
const port = '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
