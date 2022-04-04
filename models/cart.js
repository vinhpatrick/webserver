const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
}, { timestamps: true });

var Carts = mongoose.model('Cart', cartSchema);
module.exports = Carts;