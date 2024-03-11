const express = require('express');
const mongoose = require('mongoose');
const Items = require('./models/items');
const SoldItems = require('./models/sold items');

//express app
const app = express();

//connect to mongodb
const uri = "mongodb+srv://hashTheAdmin:HashTheAdmin@inventorymanagement.ekh6lts.mongodb.net/Stock-Management?retryWrites=true&w=majority&appName=InventoryManagement";
mongoose.connect(uri)
.then((result) => app.listen(9000))
.catch((err) => console.log(err));


//register view engine
app.set('view engine', 'ejs');


//static files and middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('assets'));


app.get('/', (req, res) => {
    Items.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('dashboard', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
    
});


app.post('/transaction', async (req, res) => {
    
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


app.post('/search', async (req, res) => {
    const searchTerm = req.body.search;
    console.log(searchTerm);
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





app.get('/addemployee', (req, res) => {
    res.render('addemployee');
});



app.get('/additem', (req, res) => {
    res.render('additem');
});



app.post('/additem', (req, res) =>{
    const item = new Items(req.body)
    item.save()
    .then((result) =>{
        res.redirect('/');
    })
    .catch((err) =>{
        console.log(err);
    });
})



app.get('/employeeaccounts', (req, res) => {
    res.render('employeeaccounts');
});



app.get('/login', (req, res) => {
    res.render('login');
});



app.get('/transactionhistory', (req, res) => {
    SoldItems.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('transactionhistory', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
});



app.post('/transactionhistorybydate', (req, res) => {
    SoldItems.find({
        createdAt: {
            $gte: new Date(new Date(req.body.startdate).setHours(0, 0, 0)),
            $lt: new Date(new Date(req.body.enddate).setHours(23, 59, 59))
             }
    })
    .sort({ updatedAt: -1 })
    .then((result) => {
        res.render('transactionhistory', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    })
});



app.get('/updateproducts', (req, res) => {
    Items.find().sort({ updatedAt: -1 })
    .then((result) => {
        res.render('updateproducts', {itemlist: result});
    })
    .catch((err) =>{
        console.log(err);
    });
    
});


app.post('/updateproducts', (req, res) => {
    updateddoc = Items(req.body);
Items.findByIdAndUpdate(req.body.id, req.body, { new: true })
.then((updatedProduct) => {
    console.log('Updated Product:', updatedProduct);
    res.redirect('/updateproducts');
    console.log(req.body.date);
})
.catch((err) => {
    console.error(err);
})
});


app.post('/deleteproducts', (req, res) => {
    Items.findByIdAndDelete(req.body.id)
    .then((result) => {
        res.redirect('/updateproducts');
    })
    .catch((err) => {
        console.log(err);
    });
});




app.use((req, res) => {
    res.render('404');
});

//exports.app = functions.https.onRequest(app);