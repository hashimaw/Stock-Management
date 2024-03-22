const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Items = require('./models/items');
const SoldItems = require('./models/sold items');
const Accounting = require('./models/accounting');
const { requireAuth, checkUser } = require('./middleware/authmiddleware');

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
app.use(cookieParser());
app.use(express.json());


//routes
app.get('/', requireAuth, (req, res) => {
    res.redirect('/dashboard');
})
app.get('*', checkUser);
app.use( authrouter);
app.use(requireAuth, dashboardrouter);
app.use(requireAuth, additemrouter);
app.use(requireAuth, employeerouter);
app.use(requireAuth, transactionhistoryrouter);
app.use(requireAuth, updateproductsrouter);


async function calculateCapital() {
    SoldItems.find()
    .then((result) => {
        var soldtotal = 0;
        var actualprofit = 0;
        result.forEach(item => {
            soldtotal += item.soldprice * item.quantity;
            actualprofit += item.soldprice * item.quantity - item.purchasedprice * item.quantity;
        });
        console.log('sold total: ' + soldtotal);
        console.log('actual profit: ' + actualprofit);
        Accounting.create({
            soldtotal: soldtotal,
            actualprofit: actualprofit,
        })
        return soldtotal;
    });
    Items.find()
    .then((result) => {
        var capital = 0;
        var expectedprofit = 0;
        result.forEach(item => {
            capital += item.purchasedprice * item.quantity;
            expectedprofit += item.sellingprice * item.quantity - item.purchasedprice * item.quantity;
        });
        console.log('capital: ' + capital);
        console.log('expected profit: ' + expectedprofit);
        Accounting.create({
            capital: capital,
            expectedprofit: expectedprofit,
        })
        return capital;
    });
    }

//calculateCapital();

app.use((req, res) => {
    res.render('404');
});