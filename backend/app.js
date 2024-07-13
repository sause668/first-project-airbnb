const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

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

//export app
module.exports = app;