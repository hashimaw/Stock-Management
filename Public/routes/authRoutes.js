const express = require('express');
const authrouter = express.Router();


authrouter.get('/login', (req, res) => {
    res.render('login');
});

module.exports = authrouter;