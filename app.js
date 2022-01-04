var express = require('express');
var path = require('path');
var app = express();
let alert = require('alert');
const session = require('express-session');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

var { MongoClient } = require('mongodb');
var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
var client2 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var sess = [];

function auth(req, res, next) {
    if ("username" in req.session) {
        console.log("here")
        next()

    } else {
        res.redirect('/')
    }
}
//GET requests
app.get('/', function (req, res) {
    res.render('login')
});

app.get('/books', auth, function (req, res) {
    res.render('books')
});

app.get('/boxing', auth, function (req, res) {
    res.render('boxing')
});

app.get('/cart', auth, function (req, res) {
    res.render('cart')
});

app.get('/galaxy', auth, function (req, res) {
    res.render('galaxy')
});

app.get('/home', auth, function (req, res) {
    res.render('home')
});

app.get('/iphone', auth, function (req, res) {
    res.render('iphone')
});

app.get('/leaves', auth, function (req, res) {
    res.render('leaves')
});

app.get('/phones', auth, function (req, res) {
    res.render('phones')
});

app.get('/registration', function (req, res) {
    res.render('registration')
});

app.get('/searchresults', auth, function (req, res) {
    res.render('searchresults', {})
});

app.get('/sports', auth, function (req, res) {
    res.render('sports')
});

app.get('/sun', auth, function (req, res) {
    res.render('sun')
});

app.get('/tennis', auth, function (req, res) {
    res.render('tennis')
});
//POST requests
app.post('/addgalaxy', function (req, res) {
    var product = "galaxy";
    addToCart(req, product);
});
app.post('/addiphone', function (req, res) {
    var product = "iphone";
    addToCart(req, product);
});
app.post('/addleaves', function (req, res) {
    var product = "leaves";
    addToCart(req, product);
});
app.post('/addsun', function (req, res) {
    var product = "sun";
    addToCart(req, product);
});
app.post('/addtennis', function (req, res) {
    var product = "tennis";
    addToCart(req, product);
});
app.post('/addboxing', function (req, res) {
    var product = "boxing";
    addToCart(req, product);
});
async function addToCart(req, product) {
    await client2.connect();
    console.log(req.session.username);
    var username = { username: req.session.username };
    var user = await client2.db('firstdb').collection('firstcollection').findOne(username);
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
        await client2.db('firstdb').collection('firstcollection').updateOne(username, newcart, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
        });
    }
    //client.close();
}
app.post('/cart', auth, function (req, res) {
    showCart(req, res).catch(console.error);
    //res.render('cart',{ product: , pages:  });
});
//showcart
async function showCart(req, res) {
    await client2.connect();
    var username = { username: req.session.username };
    var user = await client2.db('firstdb').collection('firstcollection').findOne(username);
    //console.log(user);
    var cart = user.cart;
    res.render('cart', { product: cart });
    //client.close();
}
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
    req.session.username = x;
    // sess = req.session;
    // sess.username = x;
    //console.log(req.session.username);
    var user = { username: x, password: y };
    login(user, res).catch(console.error);
});
//search
app.post('/search', function (req, res) {
    console.log(req.session.username);
    var x = req.body.Search;
    search(x, res).catch(console.error);
});
//
async function search(x, res) {
    await client2.connect();

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
    client2.close();
}

async function registration(x, res) {
    await client2.connect();
    var out = await client2.db('firstdb').collection('firstcollection').find({ username: x.username }).toArray();
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
        await client2.db('firstdb').collection('firstcollection').insertOne(x);
        alert("Registration was successful!");
        res.redirect('/');
    }
    client2.close();
}

async function login(x, res) {
    //console.log(req.session.username);
    await client2.connect();
    var out = await client2.db('firstdb').collection('firstcollection').find({ username: x.username, password: x.password }).toArray();
    console.log(out);
    if (out.length == 0) {
        alert("Username or password is incorrect!")
        res.render('login');
    }
    else {
        res.render('home');
    }
    client2.close();
}
//app.listen(3000);

if (process.env.PORT) {
    app.listen(process.env.PORT, function () {
        console.log('server started');
    })
}
else {
    app.listen(3000, function () {
        console.log('server started on port 3000');
    })
}
