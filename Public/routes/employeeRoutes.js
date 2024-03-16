const express = require('express');
const employeeaccountsrouter = express.Router();

employeeaccountsrouter.get('/addemployee', (req, res) => {
    res.render('addemployee');
});




employeeaccountsrouter.get('/employeeaccounts', (req, res) => {
    res.render('employeeaccounts');
});


module.exports = employeeaccountsrouter;