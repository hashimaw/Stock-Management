const express = require('express');
const path = require('path')
const uri = "mongodb+srv://hashTheAdmin:HashTheAdmin@inventorymanagement.ekh6lts.mongodb.net/?retryWrites=true&w=majority&appName=InventoryManagement";
//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');


//listen for requests 
app.listen(9000);

//static files
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/addemployee', (req, res) => {
    res.render('addemployee');
});

app.get('/additem', (req, res) => {
    res.render('additem');
});

app.get('/employeeaccounts', (req, res) => {
    res.render('employeeaccounts');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/transactionhistory', (req, res) => {
    res.render('transactionhistory');
});

app.get('/updateproducts', (req, res) => {
    res.render('updateproducts');
});

app.use((req, res) => {
    res.render('404');
});

//exports.app = functions.https.onRequest(app);