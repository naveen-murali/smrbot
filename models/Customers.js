const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    place: {
        type: String
    },
    entryTime: {
        type: Date
    },
    exitTime: {
        type: Date
    }
});

module.exports = mongoose.model('Customers', CustomerSchema, 'customers');