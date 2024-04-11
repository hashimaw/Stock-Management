const express = require('express');
const updateproductsrouter = express.Router();
const Items = require('../models/items');
const { requireAuth, checkRole } = require('../middleware/authmiddleware');
const { async } = require('postcss-js');

updateproductsrouter.get('/updateproducts',  requireAuth, checkRole, async (req, res) => {
   await Items.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('updateproducts', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
    
});

updateproductsrouter.post('/updateproducts/search',  requireAuth, checkRole, (req, res) => {
  var search = req.body.search;
  res.redirect('/updateproducts/search/' + search);
});

updateproductsrouter.get('/updateproducts/search/:search',  requireAuth, checkRole, async (req, res) => {
    const searchTerm = req.params.search;
    const searchResults = await Items.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { model: { $regex: searchTerm, $options: 'i' } },
            { type: { $regex: searchTerm, $options: 'i' } },
        ]
    });
    res.render('updateproducts', {itemlist: searchResults});
    console.log(searchResults);
    console.log(searchTerm);
})

updateproductsrouter.post('/updateproducts',  requireAuth, checkRole, async(req, res) => {
    updateddoc = Items(req.body);
await Items.findByIdAndUpdate(req.body.id, req.body, { new: true })
.then((updatedProduct) => {
    console.log('Updated Product:', updatedProduct);
    res.redirect('/updateproducts');
    console.log(req.body.date);
})
.catch((err) => {
    console.error(err);
})
});


updateproductsrouter.post('/deleteproducts',  requireAuth, checkRole, async (req, res) => {
    await Items.findByIdAndDelete(req.body.id)
    .then((result) => {
        res.redirect('/updateproducts');
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = updateproductsrouter;