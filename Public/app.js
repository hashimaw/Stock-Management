const express = require('express');
const mongoose = require('mongoose');

//routes
const additemrouter = require('./routes/additemRoutes');
const authrouter = require('./routes/authRoutes');
const dashboardrouter = require('./routes/dashboardRoutes');
const employeerouter = require('./routes/employeeRoutes');
const transactionhistoryrouter = require('./routes/transactionhistoryRoutes');
const updateproductsrouter = require('./routes/updateproductsRoutes');


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



//routes
app.get('/', (req, res) => {
    res.redirect('/dashboard');
})
app.use(authrouter);
app.use(dashboardrouter);
app.use(additemrouter);
app.use(employeerouter);
app.use(transactionhistoryrouter);
app.use(updateproductsrouter);




app.use((req, res) => {
    res.render('404');
});

//exports.app = functions.https.onRequest(app);