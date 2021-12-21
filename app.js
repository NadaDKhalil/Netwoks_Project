var express = require('express');
var path = require('path');
var app = express();
//var popupS = require('popups');
let alert = require('alert');



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

/*app.post('/', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    //console.log(x + " " + y);
    res.render('home');

});*/

app.post('/register', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    //console.log(x);
    //console.log(y);
    var user = { username: x, password: y };
    main(user, res).catch(console.error);
});

app.post('/', function (req, res) {
    var x = req.body.username;
    var y = req.body.password;
    //console.log(x);
    //console.log(y);
    var user = { username: x, password: y };
    mainlogin(user, res).catch(console.error);
});

//search Post
app.post('/search', function (req, res) {
    var x = req.body.Search;
    console.log(x);
    res.render('searchresults');
});

//Mongo atlas connection
async function main(x, res) {
    var { MongoClient } = require('mongodb');
    var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
    var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username }).toArray();
    console.log(out);
    if (out.length != 0) {
        alert("Username is already used!")
        res.render('registration');
    }
    else {
        await client.db('firstdb').collection('firstcollection').insertOne(x);
        res.render('login');
    }
    client.close();
}

async function mainlogin(x, res) {
    var { MongoClient } = require('mongodb');
    var uri = "mongodb+srv://admin:admin@cluster0.9mj9q.mongodb.net/firstdb?retryWrites=true&w=majority"
    var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    var out = await client.db('firstdb').collection('firstcollection').find({ username: x.username ,password: x.password }).toArray();
    console.log(out);
    if (out.length == 0) {
        alert("Username or password are incorrect!")
        res.render('login');
    }
    else {
        res.render('home');
    }
    client.close();
}
//main().catch(console.error);

app.listen(3000);
