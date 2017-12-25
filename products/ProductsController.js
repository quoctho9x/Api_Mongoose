// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config  = require('.././config');
router.use(bodyParser.urlencoded({ extended: true }));
var Products = require('./Products');

//text
router.get('/', function (req,res) {
    res.json({message:'wellcome you connect to api products!'})
});

//add product to colection products
router.post('/',function (req,res) {
    Products.create({
        index: req.body.index,
        name:  req.body.name,
        price:  req.body.price,
        quantity:  req.body.quantity,
        description: req.body.description,
        color: req.body.color,
        size: req.body.size,
        type:req.body.type,
        sticker: req.body.sticker,
        sale: req.body.sale,
        link: req.body.link
    },
    function (error, products) {
        if(error) return res.status(500).send('There was a problem adding the information to the database');
        res.status(200).send(products);
        /* object demo{
            "index": 3,
            "name": "index_3",
            "price": "35",
            "quantity": 1,
            "description":"index_1 Ba lô thời trang Juno cao cấp BL005 là phụ kiện không thể thiếu trong tủ đồ của mọi cô gái yêu thích sự năng động và hiện đại. Được thiết kế với kiểu dáng cá tính, độc đáo nhưng không kém phần nữ tính, duyên dáng chiếc ba lô này sẽ thu hút bạn ngay từ ánh nhìn đầu tiên.",
            "color": [
                "trang",
                "do",
                "den"
            ],
            "size": [
                38,
                39,
                40,
                41
            ],
            "sticker": "discount",
            "sale":"21",
            "link": "link",
             "type" : [
                "men",
                "new",
                "bestsale"
            ]
        }
        }*/
    })
});

// RETURNS ALL THE PRODUCTS IN THE DATABASE
router.get('/all', function (req, res) {//get
    Products.find({}, function (err, products) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(products);
    })/*.sort({id:-1}).select({id:1});*/
});

// RETURNS ONE ITEM PRODUCT IN THE DATABASE WITH INDEX
router.get('/:id',function (req,res) {
    console.log("req.params.id",req.params.id)
    Products.find({index:req.params.id},function (err, product) {
        if (err) return res.status(500).send("There was a problem finding the product.");
        if (!product) return res.status(404).send("No product found.");
        res.status(200).send(product);
    }) 
});

// GETS PRODUCT FROM THE DATABASE WHERE CONDITION
router.get('/all/:type', function (req, res) {//get
    Products.find().where('type').in([req.params.type]).exec(function(err, products) {
        if (err) return res.status(500).send("There was a problem finding the products.");
        if (!products) return res.status(404).send("No products found.");
        res.status(200).send(products);
    });

});

module.exports = router;