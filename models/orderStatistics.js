const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderStatisticsSchema = new Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    capturedTime: {
        type: Date,
        required: true,
    },
})
orderStatisticsSchema.index({ customer: 1 })
orderStatisticsSchema.index({ capturedTime: 1 })

var OrderStatistics = mongoose.model('OrderStatistic', orderStatisticsSchema);
module.exports = OrderStatistics;