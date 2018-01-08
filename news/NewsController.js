// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config  = require('.././config');
router.use(bodyParser.urlencoded({ extended: true }));
var Products = require('../products/Products');
var News = require('./News');

//text
router.get('/', function (req,res) {
    res.json({message:'wellcome you connect to api news!'})
});

//add product to colection products
router.post('/',function (req,res) {
    console.log(req.body);
    News.create({
        index: req.body.index,
        title:  req.body.title,
        date:  req.body.date,
        owner:  req.body.owner,
        summary: req.body.summary,
        content: req.body.content,
        link: req.body.link
    },
    function (error, products) {
        if(error) return res.status(500).send('There was a problem adding the information to the database');
        res.status(200).send(products);
        /*demo *{
        "index": 1,
        "title": "tile1",
        "date": "08/10/2017",
        "owner": "Nguyễn Văn Thành",
        "summary":"The aim of this project is to design a car using fuel cell technology.",
        "content":"The aim of this project is to design a car using fuel cell technology The aim of this project is to design a car using fuel cell technology The aim of this project is to design a car using fuel cell technology The aim of this project is to design a car using fuel cell technology ",
        "link":"https://bizweb.dktcdn.net/thumb/large/100/238/538/products/xanhduonglunartempo2runningsho-1ce74df5-7f8c-428e-a38c-66dcefd07a77.jpg?v=1500949649283"
        }*/
    })
});

// RETURNS ALL THE PRODUCTS IN THE DATABASE
router.get('/all', function (req, res) {//get
    News.find({}, function (err, news) {
        if (err) return res.status(500).send("There was a problem finding the news.");
        res.status(200).send(news);
    })
});

// RETURNS ONE ITEM PRODUCT IN THE DATABASE WITH INDEX
router.get('/:id',function (req,res) {
    console.log("req.params.id",req.params.id)
    News.find({index:req.params.id},function (err, news) {
        if (err) return res.status(500).send("There was a problem finding the news.");
        if (!news) return res.status(404).send("No news found.");
        res.status(200).send(news);
    }) 
});

module.exports = router;