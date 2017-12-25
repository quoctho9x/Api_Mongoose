// User.js
var mongoose = require('mongoose');
var ProductsSchema = new mongoose.Schema({
    index: Number,
    name: String,
    price: Number,
    quantity: Number,
    description: String,
    color:{},
    size:{},
    type:{},
    sticker:String,
    sale:String,
    link:String
});
var products = mongoose.model('Products', ProductsSchema);

module.exports = products;