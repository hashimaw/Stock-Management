const express = require('express');
const Users = require('../models/users');
const { async } = require('postcss-js');
const { requireAuth } = require('../middleware/authmiddleware');
const employeeaccountsrouter = express.Router();

employeeaccountsrouter.get('/addemployee', (req, res) => {
    let updateuser = null;
    res.render('addemployee', { updateuser: updateuser });
});


employeeaccountsrouter.get('/employeeaccounts', async (req, res) => {
    await Users.find().sort({ updatedAt: -1 })
        .then((users) => {
            res.render('employeeaccounts', { users: users })
        })
        .catch((err) => {
            console.log(err);
        });
});


employeeaccountsrouter.post('/addemployee', requireAuth, (req, res) => {

    const user = new Users(req.body)
    user.save()
    .then((result) =>{
        console.log(result);
        res.status(201).json({ user: result._id });
    })
    .catch((err) =>{
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        console.log(errors);
    });
});


employeeaccountsrouter.post('/addemployee/updateuser/:id', requireAuth, (req, res) => {
    console.log(req.params.id);
    Users.findByIdAndUpdate(req.params.id, req.body)
    .then((result) =>{
        console.log(result);
        res.status(201).json({ user: result._id });
    })
    .catch((err) =>{
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        console.log(errors);
    });
});


employeeaccountsrouter.get('/employeeaccounts/updateuser/:id', requireAuth, async (req, res) => {
    await Users.findById(req.params.id)
        .then((updateuser) => {
            res.render('addemployee', { updateuser: updateuser })
        })
        .catch((err) => {
            console.log(err);
        });
})

employeeaccountsrouter.get('/employeeaccounts/deleteuser/:id', requireAuth, async (req, res) => {
    await Users.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/employeeaccounts');
        })
        .catch((err) => {
            console.log(err);
        });
});


module.exports = employeeaccountsrouter;