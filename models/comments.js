const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    ratting: {
        type: Number,
        required: true,
        min: 1,
        max: 5,

    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true
})

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;