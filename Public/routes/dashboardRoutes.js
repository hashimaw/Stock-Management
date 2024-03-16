const express = require('express');
const dashboardrouter = express.Router();
const Items = require('../models/items');
const SoldItems = require('../models/sold items');

dashboardrouter.get('/dashboard', (req, res) => {
    Items.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('dashboard', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
    
});

dashboardrouter.post('/dashboard/search', (req, res) => {
    var search = req.body.search;
    res.redirect('/dashboard/' + search);
  });

dashboardrouter.get('/dashboard/:search', async (req, res) => {
    const searchTerm = req.params.search;
    const searchResults = await Items.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { model: { $regex: searchTerm, $options: 'i' } },
            { type: { $regex: searchTerm, $options: 'i' } },
        ]
    });
    res.render('dashboard', {itemlist: searchResults});
    console.log(searchResults);
    console.log(searchTerm);
})




dashboardrouter.post('/transaction', async (req, res) => {
    
    if(req.body.quantity.length == 1){
        solditemtobesaved = new SoldItems(req.body);
        Items.findById(solditemtobesaved.id)
        .then((product) => {
            if (!product) {
            console.log('Product not found');
            return;
            }

            // Check if the quantity allows for deduction
            if (product.quantity >> 0 && product.quantity >= solditemtobesaved.quantity && solditemtobesaved.quantity >> 0) {
                product.quantity -= solditemtobesaved.quantity;
                product.save();
                solditemtobesaved.save()
                    .then((result) =>{
                        Items.find().sort({ date: -1 })
                        .then((result) => {
                            res.redirect('/');
                            res.render('dashboard', {itemlist: result});
                        })
                        .catch((err) =>{
                            console.log(err);
                        });
                    })
                    .catch((err) =>{
                        console.log(err);
                    });
            } else {
            console.log('Invalid deduction');
            }
        })
        .then((updatedProduct) => {
            if (updatedProduct) {
            console.log('Updated Product:', updatedProduct);
            }
        })
        .catch((err) => {
            console.error(err);
        });

            
    } else {
        for(var i = 0; i < req.body.quantity.length; i++){
            //storing each item as an array that we get from UI
            const solditem = {
                name: req.body.name[i],
                model: req.body.model[i],
                type: req.body.type[i],
                id: req.body.id[i],
                comment: req.body.comment[i], 
                quantity: req.body.quantity[i], 
                sellingprice: req.body.sellingprice[i],
                purchasedprice: req.body.purchasedprice[i],
                soldprice: req.body.soldprice[i]
            };

            //logging each item after taking data from user interface
            console.log('an item taken from ui: ', solditem);

            //converting the data we store to our datatype or schema for mongodb
            solditemtobesaved = new SoldItems(solditem);

            //get the data from monogodb with specified id of the item
            await Items.findById(solditemtobesaved.id) 
            .then((product) => {

                //logging the data we get from mongodb with specified id of the item
                console.log('an item quered from mongo: ', product);

                //checking if the quantity allows for deduction or not and if it is greater than zero then we deduct the quantity from the quantity of the item in mongodb and update it. 
                if (product.quantity >> 0 && product.quantity >= solditemtobesaved.quantity && solditemtobesaved.quantity >> 0){
                    Items.findByIdAndUpdate(solditemtobesaved.id,
                    { $inc: { quantity: -solditemtobesaved.quantity } }, // Use $inc to decrement the quantity
                    { new: true }, // Return the updated document
                    )
                    .then((updatedProduct) => {
                        console.log('Updated Product:', updatedProduct);
                        })
                        .catch((err) => {
                        console.error(err);
                        });
                        solditemtobesaved.save();
                        } else {
                            console.log('Invalid deduction');
                            return;
                        }
            })// end of Items.findById(solditemtobesaved.id)
        }//end of for loop
                
        Items.find().sort({ date: -1 })
        .then((result) => {
            res.redirect('/');
            res.render('dashboard', {itemlist: result});
        })
        .catch((err) =>{
            console.log(err);
        });
                   
    }// end of else statement for if(req.body.quantity.length == 1)
});// end of app.post('/transaction')


module.exports = dashboardrouter;