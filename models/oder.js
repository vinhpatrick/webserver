const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    storeAddress: {
        type: String,
        required: true,
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

var Oders = mongoose.model('Oder', oderSchema);

module.exports = Oders; 