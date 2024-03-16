const express = require('express');
const transactionhistoryrouter = express.Router();
const SoldItems = require('../models/sold items');

transactionhistoryrouter.get('/transactionhistory', (req, res) => {
    SoldItems.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('transactionhistory', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
});



transactionhistoryrouter.post('/transactionhistorybydate', (req, res) => {
    SoldItems.find({
        createdAt: {
            $gte: new Date(new Date(req.body.startdate).setHours(0, 0, 0)),
            $lt: new Date(new Date(req.body.enddate).setHours(23, 59, 59))
             }
    })
    .sort({ updatedAt: -1 })
    .then((result) => {
        res.render('transactionhistory', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    })
});

module.exports = transactionhistoryrouter;