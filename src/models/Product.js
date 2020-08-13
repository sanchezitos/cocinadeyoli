const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {type:String},
    category: {type:String},
    description: {type:String},
    price: {type:String},
    size: {type:String},
    imageURL: {type: String},
    image_id: {type: String},
    user: {type: String},
    user_id: {type: String},
    date_add: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema)