const express = require('express');
const authrouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { requireAuth } = require('../middleware/authmiddleware');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', phone:'' };

    //incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'email is not registered';
    }

    //incorrect password
    if (err.message === 'incorrect password'){  
        errors.password = 'password is incorrect';
    }

    //duplicate error code
    if (err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    
    return errors;
}


// create token for user to login
const maxAge = 1 * 24 * 60 * 60; //1 day in seconds
const createToken = (id) => {
    return jwt.sign({id}, 'hashim is going to be the best developer!', {
        expiresIn: maxAge
    });
}

authrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});


authrouter.get('/login', (req, res) => {
    res.render('login');
});

authrouter.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/login');
})

authrouter.post('/addemployee', requireAuth, (req, res) => {

    const user = new User(req.body)
    user.save()
    .then((result) =>{
        const token = createToken(result._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        console.log(result);
        res.status(201).json({ user: result._id });
    })
    .catch((err) =>{
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        console.log(errors);
    });
})

module.exports = authrouter;