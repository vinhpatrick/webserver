const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactBy: {
        type: String,
        required: true
    },
    feedBack: {
        type: String,
        required: true
    }

}, { timestamps: true })

var Feedbacks = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedbacks;

