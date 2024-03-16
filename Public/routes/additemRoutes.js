const express = require('express');
const additemrouter = express.Router();
const Items = require('../models/items');


additemrouter.get('/additem', (req, res) => {
    res.render('additem');
});



additemrouter.post('/additem', (req, res) =>{
    const item = new Items(req.body)
    item.save()
    .then((result) =>{
        res.redirect('/');
    })
    .catch((err) =>{
        console.log(err);
    });
})

module.exports = additemrouter;