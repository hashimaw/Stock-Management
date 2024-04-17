const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const { requireAuth, checkUser } = require('./middleware/authmiddleware');

//routes
const additemrouter = require('./routes/additemRoutes');
const {authrouter} = require('./routes/authRoutes');
const dashboardrouter = require('./routes/dashboardRoutes');
const employeerouter = require('./routes/employeeRoutes');
const transactionhistoryrouter = require('./routes/transactionhistoryRoutes');
const updateproductsrouter = require('./routes/updateproductsRoutes');
const accounting = require('./routes/accountingRoutes');



//express app
const app = express();

//connect to mongodb
const uri = "mongodb+srv://hashTheAdmin:HashTheAdmin@inventorymanagement.ekh6lts.mongodb.net/Stock-Management?retryWrites=true&w=majority&appName=InventoryManagement";
mongoose.connect(uri)
.then((result) => app.listen(9000))
.catch((err) => console.log(err));


//register view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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
app.use( authrouter );
app.use(requireAuth, dashboardrouter);
app.use(requireAuth, transactionhistoryrouter);
app.use(requireAuth, employeerouter);
app.use(requireAuth, updateproductsrouter);
app.use(requireAuth, additemrouter);
app.use(requireAuth, accounting);


app.use((req, res) => {
    res.render('404');
});
