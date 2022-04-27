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
        required: true,
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
orderItemSchema.index({ order: 1, product: 1 })
var OrderItems = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItems;