const mongoose = require('mongoose');

const accountingschema = new mongoose.Schema({
    capital: Number,
    soldtotal: Number,
    estimatedprofit: Number,
    profit: Number,
    },{timestamps:true });

    const Accounting = mongoose.model('Accounting', accountingschema);
    module.exports = Accounting;