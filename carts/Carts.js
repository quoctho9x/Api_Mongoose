// User.js
var mongoose = require('mongoose');
var CartsSchema = new mongoose.Schema({
    id: String,
    status: String,
    time: String,
    info_user:{},
    info_cart:{},
    info_pay:{}
});
var carts = mongoose.model('Carts', CartsSchema);

module.exports = carts;