// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
//var multer = require('multer');
var path = require('path');
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

app.use(express.static('public'));
/*var storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,'./public/Images')
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname);
    }
});*/

//var upload = multer({storage:storage});

/*app.post('/upload',upload.single('file'),function (req,res) {
    console.log('day image',req.file);
    console.log('day content',req.body.user);
    //console.log('link ', app.use(express.static(__dirname + 'upload')));
    //res.send('upload thanh cong')
});*/
//app.use('/images', express.static(__dirname + '/Images'));
app.set('view engine', 'ejs');

/*app.use('/upload', function(req, res) {
    res.render('index')
});*/
// =======================
// API ROUTES  ======
// =======================

// API ROUTES PRODUCTS
var ProductsController = require('./products/ProductsController');
app.use('/api/products', ProductsController);

// API ROUTES NEWS
var NewsController = require('./news/NewsController');
app.use('/api/news', NewsController);

// API ROUTES CARTS
var CartsController = require('./carts/CartsController');
app.use('/api/carts', CartsController);

// API ROUTES USER
var UserController = require('./user/UserController');
app.use('/api', UserController);

// =======================
// start the server ======
// =======================
var server =  app.listen(port,function () {
    console.log('Express server listening on port ' + port);
});

