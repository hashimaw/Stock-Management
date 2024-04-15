const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Accounting = require('../models/accounting');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'hashim is going to be the best developer!', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
               // console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}


//check current user
let userrole;

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'hashim is going to be the best developer!', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                userrole = null;
                next();
            } else {
               // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                let accounting = await Accounting.findOne().sort({updatedAt: -1}).exec();
                res.locals.user = user;
                res.locals.accounting = accounting;
                userrole = user.role;
                next();
            }
        });
    } else {
        res.locals.user = null;
        userrole = null;
        next();
    }
}


//check user roles
const checkRole = async (req, res, next) => {
    if (userrole === 'admin') {
        next();
    }
    else {
        res.status(401);
        res.send('You are not authorized');
        
    }
}


module.exports = { requireAuth, checkUser, checkRole };