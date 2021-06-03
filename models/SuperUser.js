const mongoose = require('mongoose');

const SperUserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    createdTime: {
        type: Date
    },
    lastLogin: {
        type: Date
    }
})

module.exports = mongoose.model('SuperUsers', SperUserSchema, 'super_users');