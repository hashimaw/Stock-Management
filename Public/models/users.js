const mongoose = require('mongoose');
const bcrpt = require('bcrypt');
const { isEmail } = require('validator');

const usersschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email:{
        type:String,
        unique: true,
        required: [true, 'Please enter an email'],
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    age: Number,
    phone: {
        type: String,
        required: [true, 'please enter a phone number'],
        validate: {validator: function(v) {
            // Regex to validate a 10 digit phone number
            return /\d{10}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: String,
    gender: String,
    password: {
        type:String,
        required: [true, 'please enter a password'],
        minLength: [8, 'minimum password length is 8 characters long']
    },
    role: String,
    },{timestamps:true });


    //fire function before doc saved to db
    usersschema.pre('save', async function(next){
        const salt = await bcrpt.genSalt();
        this.password = await bcrpt.hash(this.password, salt);
        next();
    })


    //static method to login user
    usersschema.statics.login = async function(email, password){
        const user = await this.findOne({email});
        if(user){
            const auth = await bcrpt.compare(password, user.password);
            if(auth){
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }

    const Users = mongoose.model('user', usersschema);
    module.exports = Users;