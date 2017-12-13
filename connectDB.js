var mongoose = require('mongoose');
var config  = require('./config');
/*mongoose.connect('mongodb://localhost:27017/shoping');*/
mongoose.connect(config.database);

// Mở một connection tới DB và in ra thông tin 'we are connected!' nếu Mongoose kết nối với MongoDB thành công
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected!');
});