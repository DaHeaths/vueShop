let mongoose = require('mongoose')

const Schema = mongoose.Schema

let productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "productUrl": String
})

module.exports = mongoose.model('Goods', productSchema)
