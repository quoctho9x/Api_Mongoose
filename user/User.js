// User.js
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    id: Number,
    user_name: String,
    password: String,
    email: String,
    phone:Number,
    birthday:String,
    address:String,
    avatar:String
});
var user = mongoose.model('User', UserSchema);

module.exports = user;