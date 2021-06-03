const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    phoneOTP: {
        type: String,
        required: true
    },
    emailOTP: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '10m',
        default: new Date()
    }
});

module.exports = mongoose.model('OTP', OTPSchema, 'otp_collection');