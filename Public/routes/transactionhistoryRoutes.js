const express = require('express');
const transactionhistoryrouter = express.Router();
const SoldItems = require('../models/sold items');
const Item = require('../models/items');
const { requireAuth, checkUser, checkRole } = require('../middleware/authmiddleware');
const { async } = require('postcss-js');

transactionhistoryrouter.get('/transactionhistory', requireAuth, async (req, res) => {
    await SoldItems.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('transactionhistory', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
});

transactionhistoryrouter.post('/transactionhistory/bydate', requireAuth, (req, res) => {
    var startDate = req.body.startdate;
    var endDate = req.body.enddate;
    res.redirect('/transactionhistory/' + startDate +'/' + endDate);
})


transactionhistoryrouter.get('/transactionhistory/:startDate/:endDate', requireAuth, async (req, res) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    await SoldItems.find({
        createdAt: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
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


transactionhistoryrouter.get('/transationrestore/:id', requireAuth, checkRole, async (req, res)=>{
    const id = req.params.id;
    await SoldItems.findById(id)
    .then((result)=>{
        console.log(result);
        const itemid=result.id
        const itemquantity={quantity: result.quantity}
        Item.findByIdAndUpdate(itemid, {$inc: itemquantity}, { new: true })
        .then((result)=>{
            console.log(result);
            SoldItems.findByIdAndDelete(id)
            .then(()=>{
                res.redirect('/transactionhistory');
            }).catch((err)=>{console.log(err)})
        })
        .catch((err)=>{console.log(err)})
    })
    .catch((err)=>{console.log(err)})
});

module.exports = transactionhistoryrouter;