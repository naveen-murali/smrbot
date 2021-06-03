const mongoose = require('mongoose');

const SMS_schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    smsStatus: [
        {
            sid: String,
            to: String,
            dateCreated: Date
        }
    ],
    day: {
        type: Date
    }
});

module.exports = mongoose.model('SMS', SMS_schema, 'sms_collection');