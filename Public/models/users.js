const mongoose = require('mongoose');

const usersschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email:{
        type:String,
        unique:true,
        required:true,
    },
    age: Number,
    phone: Number,
    address: String,
    gender: String,
    password: {
        type:String,
        required:true,
        minlength:8,
    },
    role: String,
    },{timestamps:true });

    const Users = mongoose.model('user', usersschema);
    module.exports = Users;