const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    storeAddress: {
        type: String,
        default: '444 Cầu Giấy',
    },
    receiverAddress: {
        type: String,
        required: true,
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [
            'Waiting for seller confirm',
            'In transit',
            'Delivered',
            'Cancelled by customer',
            'Cancelled by seller',
        ],
        default: 'Waiting for seller confirm',

    }
}, { timestamps: true })
orderSchema.index({ user: 1, status: 1 })
var Orders = mongoose.model('Order', orderSchema);

module.exports = Orders; 