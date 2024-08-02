const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');

//true if the environment is in production
const { environment } = require('./config');
const isProduction = environment === 'production';

//Initialize the Express application
const app = express();

//Connect the morgan middleware for logging information about requests and responses:
app.use(morgan('dev'));

//cookie-parser middleware for parsing cookies
app.use(cookieParser());

//express.json middleware for parsing JSON bodies
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}
  
// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Connect all the routes
app.use(routes); 

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    let userExists = false;
    
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }

    //New message for non unique usernames anf emails
    if (errors.email === 'email must be unique') {
      errors.email = 'User with that email already exists';
      userExists = true;
    }

    if (errors.username === 'username must be unique') {
      errors.username = 'User with that email already exists';
      userExists = true;
    }

    err.message = (userExists) ? 'User already exists':'Validation error';
    err.status = (userExists) ? 500:400;
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);

  const errRes = {
    message: err.message,
    errors: err.errors
  };

  if (err.title === 'Server Error') {
    errRes.title = 'Server Error'
  }

  if (!isProduction) {
    errRes.stack = err.stack
  }

  res.json(errRes);
});

//export app
module.exports = app;