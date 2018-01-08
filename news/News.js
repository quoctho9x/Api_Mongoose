// User.js
var mongoose = require('mongoose');
var NewsSchema = new mongoose.Schema({
    index: Number,
    title: String,
    date: String,
    owner: String,
    summary: String,
    content:String,
    link:String
});
var news = mongoose.model('News', NewsSchema);

module.exports = news;