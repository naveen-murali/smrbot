const CustomersSchema = require('../models/Customers');
const AlertSchema = require('../models/Alert');

module.exports = {
    FIND_CUSTOMER: (userId, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customer = await CustomersSchema.findOne({ _id: id, userId });
                resolve(customer);
            } catch (err) {
                console.error(err);
                resolve({});
            }
        });
    },

    SEND_ALERT: (userId, customerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let alert = await AlertSchema.findOneAndUpdate(
                    { userId },
                    {
                        $push: {
                            alerts: {
                                customerId,
                                new: true
                            }
                        }
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );
                resolve({ status: true });
            } catch (err) {
                console.error(err);
                resolve(null);
            }
        });
    }
}