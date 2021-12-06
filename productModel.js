const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please include the product name"],
  },
  price: {
    type: Number,
    required: [true, "Please include the product price"],
  },

});
//const Product = mongoose.model("Product", productSchema);
client.db('firstdb').collection('product').insertmany();
module.exports = Product;