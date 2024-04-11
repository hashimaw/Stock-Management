const express = require('express');
const additemrouter = express.Router();
const Items = require('../models/items');
const { requireAuth, checkRole } = require('../middleware/authmiddleware');
const { async } = require('postcss-js');


additemrouter.get('/additem', requireAuth, checkRole, (req, res) => {
    res.render('additem');
});



additemrouter.post('/additem', requireAuth, checkRole, async (req, res) =>{
    const item =   new Items(req.body)
    await item.save()
    .then((result) =>{
        res.redirect('/');
    })
    .catch((err) =>{
        console.log(err);
    });
})

module.exports = additemrouter;