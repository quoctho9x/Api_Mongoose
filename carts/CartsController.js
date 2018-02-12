// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
router.use(bodyParser.urlencoded({ extended: true }));
var Carts = require('./Carts');
//config send mail
var transporter = nodemailer.createTransport('smtps://quoctho9x%40gmail.com:0977400497@smtp.gmail.com');

//test
router.get('/', function (req,res) {
    Carts.find({}, function(err, carts) {
        console.log('carts',carts.length);
        if (err) throw err;
        if (!carts) {
            res.json({ success: false, message: 'Email user not found.' });
        } else {
            res.status(200).send(carts);
        }
    });
  /*  res.json({message:'hello'})*/
});
 var create_ordercart =function (id) {


 };
//add cart to collection carts
router.post('/',function (req,res) {
    var id = '';
    var orderCart = JSON.parse(req.body.orderCart);
    var currentdate = new Date();
    Carts.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, post) {
        if(err)  return res.status(500).send('database is null');
        id_curent = parseInt(post.id)+1;
        id = '00'+ id_curent;
        console.log(orderCart.user.email);
        Carts.create({
                id: id,
                status:  'binh thuong',
                time:  currentdate,
                info_user:  orderCart.user,
                info_cart:  orderCart.cart,
                info_pay:  orderCart.thanhtoan
            },
            function (error, carts) {
                if(error) return res.status(500).send('There was a problem adding the information to the database');
                //send mail
                var mailOptions = {
                    from: '"QuocTho 👻" <quoctho9x@gmail.com>', // sender address
                    to: orderCart.user.email, // list of receivers
                    subject: 'đặt hàng thành công ✔', // Subject line
                    text: 'đợn hàng của bạn đã được đặt thành công', // plaintext body
                    html: '<div>cảm ơn ban đẵ đặt hàng tại cữa hàng chúng tôi.'
                             +'<p> mã đơn hàng của quý khác là #'+id+' </p>'
                             +'<p> chúng tôi sẽ sớm liên hệ với quý khách để thông báo tình trạng đơn hàng </p>'
                             +'<p> cảm ơn quý khách ! </p>'
                           +'</div>' // html body

                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.status(200).send(carts);
            })
    });
    /*Carts.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
        id_curent = parseInt(post.id)+1;
        id = '00'+ id_curent;
        console.log(post.id);
        console.log(id);
        Carts.create({
                id: id,
                status:  'binh thuong',
                time:  currentdate,
                info_user:  orderCart.cart,
                info_cart:  orderCart.user,
                info_pay:  orderCart.thanhtoan
            },
            function (error, carts) {
                if(error) return res.status(500).send('There was a problem adding the information to the database');
                //send mail
                /!*var mailOptions = {
                    from: '"QuocTho 👻" <quoctho9x@gmail.com>', // sender address
                    to: 'quoctho8x@gmail.com', // list of receivers
                    subject: 'subject Hello ✔', // Subject line
                    text: 'text Hello world ?', // plaintext body
                    html: '<b>html Hello world ?</b>' // html body
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });*!/
                res.status(200).send(carts);
            })
    });
*/
});

// RETUNRS LIST CARS OF USER (EMAIL)
router.post('/cartsforuser', function (req, res) {
    var orderCartUser = JSON.parse(req.body.info_user);
    //console.log(orderCartUser.email)
    Carts.find({
        'info_user.email' : orderCartUser.email
    }, function(err, carts) {
        //console.log('carts',carts);
        if (err) throw err;
        if (!carts) {
            res.json({ success: false, message: 'Email user not found.' });
        } else {
            res.status(200).send(carts);
        }
    });
});

module.exports = router;