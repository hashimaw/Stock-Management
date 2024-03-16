const mongoose = require('mongoose');

const accountingschema = new mongoose.Schema({
    capital: Number,
    soldtotal: Number,
    expectedprofit: Number,
    actualprofit: Number,
    },{timestamps:true });

    const Accounting = mongoose.model('accounting', accountingschema);
    module.exports = Accounting;