const express = require('express');
const accounting = express.Router();
const Items = require('../models/items');
const SoldItems = require('../models/sold items');
const Accounting = require('../models/accounting');
const { requireAuth, checkRole } = require('../middleware/authmiddleware');
const { async } = require('postcss-js');

accounting.get('/viewbalance', requireAuth, checkRole, async (req, res) => {
    var soldtotal = 0;
    var profit = 0;
    var capital = 0;
    var estimatedprofit = 0;
    await SoldItems.find()
    .then((result) => {
        result.forEach(item => {
            soldtotal += item.soldprice * item.quantity;
            profit += item.soldprice * item.quantity - item.purchasedprice * item.quantity;
        });
    });
    await Items.find()
    .then((result) => {
        result.forEach(item => {
            capital += item.purchasedprice * item.quantity;
            estimatedprofit += item.sellingprice * item.quantity - item.purchasedprice * item.quantity;
        });
    });
    console.log('capital: ' + capital);
    console.log('estimated profit: ' + estimatedprofit);
    console.log('sold total: ' + soldtotal);
    console.log('profit: total' + profit);

    Accounting.create({
        capital: capital,
        estimatedprofit: estimatedprofit,
        soldtotal: soldtotal,
        profit: profit,
    }).then((result) => {
        console.log(result);
        res.locals.accounting = result;
    });
    res.redirect('/');
});

module.exports = accounting;