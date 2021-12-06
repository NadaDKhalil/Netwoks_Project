var express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');
const { CallTracker } = require('assert/strict');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('login')
});

app.get('/books', function (req, res) {
    res.render('books')
});

app.get('/boxing', function (req, res) {
    res.render('boxing')
});

app.get('/cart', function (req, res) {
    res.render('cart')
});
app.post("/cart", urlencodedParser, function (req, res) {
    // console.log(req.body())
    // res.redirect();
    const user = req.body();
    Cart.push(user);
    res.json(Cart);
    
    
});

app.get('/galaxy', function (req, res) {
    res.render('galaxy')
});

app.get('/home', function (req, res) {
    res.render('home')
});

app.get('/iphone', function (req, res) {
    res.render('iphone')
});

app.get('/leaves', function (req, res) {
    res.render('leaves')
});

app.get('/phones', function (req, res) {
    res.render('phones')
});

app.get('/registration', function (req, res) {
    res.render('registration')
});

app.get('/searchresults', function (req, res) {
    res.render('searchresults')
});

app.get('/sports', function (req, res) {
    res.render('sports')
});

app.get('/sun', function (req, res) {
    res.render('sun')
});

app.get('/tennis', function (req, res) {
    res.render('tennis')
});

app.post('/', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    console.log(x + " " + y);
    res.render('home');

});
//data in db 
var product = [
    {
    name : "Galaxy S21 Ultra",
    price : "18,000"

},

{
    name : "iPhone 13 Pro",
    price : '23,000'

},


{
    name : "Leaves of Grass",
    price : '180'

},

{
    name : "The Sun and Her Flowers",
    price : '200'

},
{
    name : "Boxing Bag",
    price : '300'

},
{
    name : "Tennis Racket",
    price : '500'

}
];

console.log("nada");
//Mongo atlas connection
async function main() {
    console.log("nada");
    var { MongoClient } = require('mongodb');
    var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
    var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    var user = { username: "User2", password: "Pass2" };
    // await client.db('firstdb').collection('firstcollection').insertOne(user);
    // await client.db('firstdb').createCollection("product");
    // await client.db('firstdb').createCollection("cart");
    // await client.db('firstdb').collection('product').insertMany(product)
    // var output = await client.db('firstdb').collection('firstcollection').find().toArray();
    var temp = await client.db('firstdb').collection('product').find().toArray();
    var temp1 = await client.db('firstdb').collection('cart').find().toArray();
    console.log(temp);
    console.log(temp1);
    console.log("nada");



    client.close();
}
main().catch(console.error);

app.listen(4000);
