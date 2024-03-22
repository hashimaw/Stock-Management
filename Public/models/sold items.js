const mongoose = require('mongoose');

const solditemsschema = new mongoose.Schema({
    name: String,
    model: String,
    type: String,
    date: Date,
    quantity: Number,
    sellingprice: Number,
    soldprice: Number,
    purchasedprice: Number,
    comment: String,
    id: String,
    },{timestamps:true });

    const SoldItems = mongoose.model('Sold Item', solditemsschema);
    module.exports = SoldItems;