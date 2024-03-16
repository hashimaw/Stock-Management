const express = require('express');
const updateproductsrouter = express.Router();
const Items = require('../models/items');

updateproductsrouter.get('/updateproducts', (req, res) => {
    Items.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('updateproducts', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
    
});

updateproductsrouter.post('/updateproducts/search', (req, res) => {
  var search = req.body.search;
  res.redirect('/updateproducts/search/' + search);
});

updateproductsrouter.get('/updateproducts/search/:search', async (req, res) => {
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

updateproductsrouter.post('/updateproducts', (req, res) => {
    updateddoc = Items(req.body);
Items.findByIdAndUpdate(req.body.id, req.body, { new: true })
.then((updatedProduct) => {
    console.log('Updated Product:', updatedProduct);
    res.redirect('/updateproducts');
    console.log(req.body.date);
})
.catch((err) => {
    console.error(err);
})
});


updateproductsrouter.post('/deleteproducts', (req, res) => {
    Items.findByIdAndDelete(req.body.id)
    .then((result) => {
        res.redirect('/updateproducts');
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = updateproductsrouter;