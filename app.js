var express = require('express');
var path = require('path');
var app = express();
let alert = require('alert');
const session = require('express-session');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

var { MongoClient } = require('mongodb');
var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sess;
//GET requests
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
    res.render('searchresults', {})
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
//POST requests
app.post('/addgalaxy', function (req, res) {
    var product = "galaxy";
    addToCart(product);
});
app.post('/addiphone', function (req, res) {
    var product = "iphone";
    addToCart(product);
});
app.post('/addleaves', function (req, res) {
    var product = "leaves";
    addToCart(product);
});
app.post('/addsun', function (req, res) {
    var product = "sun";
    addToCart(product);
});
app.post('/addtennis', function (req, res) {
    var product = "tennis";
    addToCart(product);
});
app.post('/addboxing', function (req, res) {
    var product = "boxing";
    addToCart(product);
});
async function addToCart(product) {
    await client.connect();
    var username = { username: sess.username };
    var user = await client.db('firstdb').collection('firstcollection').findOne(username);
    console.log(user);
    var cart = user.cart;
    var found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] == product) {
            found = true;
        }
    }
    if (found) {
        alert("Product is already in your cart!");
    }
    else {
        alert("Product is added successfully!")
        cart.push(product);
        var newcart = { $set: { cart: cart } };
        await client.db('firstdb').collection('firstcollection').updateOne(username, newcart, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
        });
    }
    //client.close();
}
app.post('/cart', function (req, res) {
    //res.render('cart',{ product: , pages:  });
});
//registration
app.post('/register', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    var user = { username: x, password: y, cart: [] };
    registration(user, res).catch(console.error);
});
//login
app.post('/', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    sess = req.session
    sess.username = x;
    var user = { username: x, password: y };
    login(user, res).catch(console.error);
});
//search
app.post('/search', function (req, res) {
    var x = req.body.Search;
    search(x, res).catch(console.error);
});
//
async function search(x, res) {
    await client.connect();

    var result = []
    var resultPages = []
    var out = ["Boxing Bag", "Galaxy S21 Ultra", "iPhone 13 Pro", "Leaves of Grass", "The Sun and Her Flowers", "Tennis Racket"];
    var outPages = ["boxing", "galaxy", "iphone", "leaves", "sun", "tennis"]

    for (let i = 0; i < out.length; i++) {
        if (out[i].toLowerCase().includes(x.toLowerCase())) {
            console.log(out[i]);
            result.push(out[i]);
            resultPages.push(outPages[i]);
        }
        console.log();
    }
    console.log(result);
    if (result.length == 0 || x == "") {
        alert("Item not found")
    }
    else {
        res.render('searchresults', { product: result, pages: resultPages });
    }
    client.close();
}

async function registration(x, res) {
    await client.connect();
    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username }).toArray();
    console.log(out);
    if (out.length != 0) {
        alert("Username is already used!")
        res.render('registration');
    }
    else if (x.username == "" || x.password == "") {
        alert("Username and Password can not be empty!");
        res.redirect('registration');
    }
    else {
        await client.db('firstdb').collection('firstcollection').insertOne(x);
        alert("Registration was successful!");
        res.redirect('/');
    }
    client.close();
}

async function login(x, res) {
    await client.connect();
    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username, password: x.password }).toArray();
    console.log(out);
    if (out.length == 0) {
        alert("Username or password is incorrect!")
        res.render('login');
    }
    else {
        res.render('home');
    }
    client.close();
}
//main().catch(console.error);
app.listen(3000);