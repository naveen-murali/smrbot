const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String
    },
    zip: {
        type: Number
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    googleImg: {
        type: String
    },
    localImg: {
        type: String
    },
    profileImg: {
        type: String
    },
    createdTime: {
        type: Date
    },
    lastLogin: {
        type: Date
    }
})

module.exports = mongoose.model('Users', UserSchema, 'users');