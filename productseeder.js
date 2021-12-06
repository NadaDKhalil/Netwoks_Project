var product =require('./productModel');

client.connect();

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
client.db('firstdb').collection('product').insertmany(product);