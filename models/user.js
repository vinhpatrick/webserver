var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
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
        default: ""

    },
    address: {
        type: String,
        default: ""

    },
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

