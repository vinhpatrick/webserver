const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    }
}, { timestamps: true })

var OrderItems = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItems;