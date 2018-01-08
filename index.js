// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config  = require('./config');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000;
var jwt = require('jsonwebtoken');
var connectDB = require('./connectDB'); //ADD database from MongoDB
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// =======================
// API ROUTES  ======
// =======================

// API ROUTES PRODUCTS
var ProductsController = require('./products/ProductsController');
app.use('/api/products', ProductsController);

// API ROUTES NEWS
var NewsController = require('./news/NewsController');
app.use('/api/news', NewsController);

// API ROUTES USER
var UserController = require('./user/UserController');
app.use('/api', UserController);

// =======================
// start the server ======
// =======================
var server =  app.listen(port,function () {
    console.log('Express server listening on port ' + port);
});

