const mongoose = require('mongoose');

const itemsschema = new mongoose.Schema({
    name: String,
    model: String,
    type: String,
    date: Date,
    quantity: Number,
    purchasedprice: Number,
    sellingprice: Number,
    },{timestamps:true });

    const Items = mongoose.model('Items', itemsschema);
    module.exports = Items;