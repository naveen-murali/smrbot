const mongoose = require('mongoose');

const Alerts_Sub_Schema = new mongoose.Schema({
    customerId: mongoose.Types.ObjectId,
    new: Boolean,
    date: {
        type: Date,
        default: new Date()
    }
})

const AlertSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    alerts: {
        type: [Alerts_Sub_Schema]
    }
});

module.exports = mongoose.model('Alert', AlertSchema, 'alerts');