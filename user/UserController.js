// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config  = require('.././config');
router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');

//text
router.get('/', function (req,res) {
    res.json({message:'wellcome you connect to api!'})
})
// route to authenticate a user
router.post('/users/authenticate', function (req, res) {//insert
    User.findOne({
        user_name: req.body.user_name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload ={user:user};
                /* var token = jwt.sign(payload, config.secret);*/
                var token = jwt.sign(payload, config.secret, {
                    expiresIn   : 600 // expires in 10m
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    expiresIn :600,
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
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// CREATES A NEW USER
router.post('/users', function (req, res) {//insert
    User.create({
            user_name : req.body.user_name,
            email : req.body.email,
            password : req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/users', function (req, res) {//get
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send({status:'ok',data:users});
    }).sort({id:-1}).select({
        id:1,
        user_name:1,
        password:1
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
router.get('/users/id', function (req, res) {//get
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

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/users/:id', function (req, res) {//update

    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});
module.exports = router;