// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var config  = require('.././config');
router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');

var storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,'./public/Images')
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname);
    }
});
var upload = multer({storage:storage});
// UPDATES A SINGLE USER IN THE DATABASE
router.post('/upload',upload.single('file'),function (req,res) {
    var user = JSON.parse(req.body.user);
    var avatart = user.avatar;
    if(req.file){
        avatart = "https://quoctho.herokuapp.com/Images/"+req.file.filename ;
    }
    var new_user = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        birthday: user.birthday,
        address: user.address,
        avatar:avatart
    };
    User.findByIdAndUpdate(user._id, new_user, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// CREATES A NEW USER
router.post('/users', function (req, res) {//insert
    User.create({
            user_name : req.body.user_name,
            email : req.body.email,
            password : req.body.password,
            phone:req.body.phone,
            birthday:req.body.birthday,
            address:req.body.address,
            avatar:req.body.avatar
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// route to authenticate a user
router.post('/users/authenticate', function (req, res) {//insert
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload ={user:user};
                /* var token = jwt.sign(payload, config.secret);*/
                var token = jwt.sign(payload, config.secret, {
                    expiresIn   : 3600 // expires in 1hour
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    expiresIn :3600,
                    user:user
                });
            }
        }
    });
});

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token -> return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/users', function (req, res) {//get
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send({status:'ok',data:users});
    }).sort({id:-1}).select({
        id:1,
        user_name:1,
        password:1,
        phone:1,
        birthday:1,
        address:1,
        avatar:1
    });
});
// RETURNS A USER WITH {USERNAME, PASSWORD}
router.post('/users/login', function (req, res) {//insert
    User.find({'user_name': req.body.user_name,'password':req.body.password}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.post('/users/id', function (req, res) {//get
    user = req.decoded.user;
    console.log(user._id);
    User.findById(user._id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// GETS USERS FROM THE DATABASE gt 30
router.get('/users/dieukien/age30', function (req, res) {//get
    User.find().where('age').gt(30).exec(function(err, users) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!users) return res.status(404).send("No user found.");
        res.status(200).send(users);
    });

});

// DELETES A USER FROM THE DATABASE
router.delete('/users/:id', function (req, res) {//delete
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.name +" was deleted.");
    });
});


router.put('/users/:id', function (req, res) {//update
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});
module.exports = router;