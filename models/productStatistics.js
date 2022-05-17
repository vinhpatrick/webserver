const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productStatisticsSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    capturedTime: {
        type: Date,
        required: true,
    },
})

productStatisticsSchema.index({ product: 1, capturedTime: 1 })

var ProductStatistics = mongoose.model('ProductStatistic', productStatisticsSchema)
module.exports = ProductStatistics
