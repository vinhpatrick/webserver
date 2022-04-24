const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5,
        max: 5,
        min: 1
    },
    category: {
        type: String,
    },
    images: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    originalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
    },
    view: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
})

var Products = mongoose.model('Product', productSchema);
module.exports = Products;
