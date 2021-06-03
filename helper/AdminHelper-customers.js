// schema for customers.
const CustomersSchema = require('../models/Customers');

// schema for alert.
const AlertSchema = require('../models/Alert');

// schema for sms status.
const SMS_Schema = require('../models/SMS_status');

// sms.
const sms = require('./sms');

// creating an objectID instance.
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    GET_CUSTOMERS_LENG: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customer_status = await CustomersSchema.aggregate([
                    {
                        $match: { userId: ObjectId(userId) }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            total_customer: { $sum: 1 },
                            new_customer: { 
                                $sum: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                {
                                                    userId
                                                },
                                                {
                                                    $gte: ["$entryTime", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)]
                                                }
                                            ]
                                        },
                                        then: 1,
                                        else: 0
                                    }
                                }
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "alerts",
                            localField: "_id",
                            foreignField: "userId",
                            as: "alerts"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            total_customer: 1,
                            new_customer: 1,
                            alerts: {
                                $first: "$alerts"
                            }
                        }
                    },
                    {
                        $unwind: "$alerts.alerts"
                    },
                    {
                        $group: {
                            _id: {
                                total_customer: "$total_customer",
                                new_customer: "$new_customer"
                            },
                            new_alerts: { $sum: { $cond: ["$alerts.alerts.new", 1, 0] } }
                        }
                    }
                ]);

                if (customer_status != 0)
                    return resolve({
                        total_customer: customer_status[0]._id.total_customer ? customer_status[0]._id.total_customer : 0,
                        new_customer: customer_status[0]._id.new_customer ? customer_status[0]._id.new_customer : 0,
                        new_alerts_count: customer_status[0].new_alerts ? customer_status[0].new_alerts : 0
                    });
                
                return resolve({ total_customer: 0, new_customer: 0, new_alerts: 0 });
            } catch (err) {
                console.error(err);
                resolve({ total_customer: 0, new_customer: 0, new_alerts: 0 });
            }
        });
    },

    GET_CHART_DATA: (userId) => {
        return new Promise(async (resolve, reject) => {
            let label = [];
            let data = [];

            for (let i = 6; i >= 0; i--) {
                let date = new Date;
                let day = date.getDate();

                date.setDate(date.getDate() - i);
                label.push(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

                data.push(await CustomersSchema.countDocuments(
                    {
                        userId,
                        entryTime: {
                            $gte: new Date(date.getFullYear(), date.getMonth() + 1, day - i, 0, 0, 0),
                            $lte: new Date(date.getFullYear(), date.getMonth() + 1, day - i, 23, 59, 59)
                        }
                    }));
            }

            if (data && label) {
                resolve({ data, label });
            }
        });
    },

    GET_NEW_ALERTS: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let new_alerts = await AlertSchema.aggregate([
                    {
                        $match: { userId: ObjectId(userId) }
                    },
                    {
                        $unwind: "$alerts"
                    },
                    {
                        $group: {
                            _id: 0,
                            new_alerts: {
                                $sum: {
                                    $cond:["$alerts.new", 1, 0]
                                }
                            }
                        }
                    }
                ]);

                if (new_alerts.length == 0)
                    return resolve(0);
                
                return resolve(new_alerts[0].new_alerts);
            } catch (err) {
                console.error(err);
                return resolve(0);
            }
        });
    },

    GET_ALERTS: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // await AlertSchema.updateOne({ "alerts.customerId": "608aad22fd1fe10c504c0de5" }, { "alerts.$.new": false });
                let alerts = await AlertSchema.aggregate([
                    {
                        $match: { userId }
                    },
                    {
                        $unwind: "$alerts"
                    },
                    {
                        $project: {
                            _id: 0,
                            new: "$alerts.new",
                            alerts: "$alerts"
                        }
                    },
                    {
                        $lookup: {
                            from: "customers",
                            localField: "alerts.customerId",
                            foreignField: "_id",
                            as: "alerts"
                        }
                    },
                    {
                        $unwind: "$alerts"
                    },
                    {
                        $addFields: { "alerts.new": "$new" }
                    },
                    {
                        $group: {
                            _id: "$new",
                            alerts: { $push: "$alerts" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: -1 }
                    }
                ]);
                
                if (alerts.length === 0)
                    return resolve({ new_alerts: 0, new_alerts_count: 0, old_alerts: 0 });

                return resolve({
                    new_alerts: alerts[0].alerts,
                    new_alerts_count: alerts[0].count,
                    old_alerts: alerts[1].alerts
                });
            } catch (err) {
                console.error(err);
                resolve({
                    new_alerts: 0,
                    new_alerts_count: 0,
                    old_alerts: 0
                });
            }
        });
    },

    GET_CUSTOMERS: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customers = await CustomersSchema.find({ userId });
                resolve(customers)
            } catch (err) {
                console.log(err);
                resolve({});
            }
        });
    },

    GET_SEARCH_DATA: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let searchData = await CustomersSchema.aggregate([
                    {
                        "$search": {
                            "autocomplete": {
                                "query": `${data}`,
                                "path": "name"
                            }
                        }
                    }
                ]);
                resolve(searchData);
            } catch (err) {
                console.log(err);
                resolve({});
            }
        })
    },

    SEARCH_BY_NAME: (userId, name) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customers = await CustomersSchema.find({ userId, name });
                resolve(customers)
            } catch (err) {
                console.log(err);
                resolve([]);
            }
        });
    },

    SEARCH_BY_ID: (userId, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customer = await CustomersSchema.find({ _id: id, userId });
                
                resolve(customer);
            } catch (err) {
                console.log(err);
                resolve({});
            }
        });
    },

    SEARCH_BY_FULL: (userId, {name, phone, place}) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customer = await CustomersSchema.find({ userId, name: name.toLowerCase(), phone, place: place.toLowerCase() });
                resolve(customer);
            } catch (err) {
                console.log(err);
                resolve([]);
            }
        });
    },

    SEARCH_BY_DATE: (userId, date) => {
        return new Promise(async (resolve, reject) => {
            let entryTime = new Date(date);
            entryTime.setHours(0);
            entryTime.setMinutes(0);
            entryTime.setSeconds(0);
            entryTime.setMilliseconds(0);

            let exitTime = new Date(date);
            exitTime.setHours(23);
            exitTime.setMinutes(59);
            exitTime.setSeconds(59);
            exitTime.setMilliseconds(59);

            try {
                let customers = await CustomersSchema.find({
                    userId,
                    entryTime: {
                        $gt: entryTime,
                        $lt: exitTime
                    },
                    exitTime: {
                        $gt: entryTime,
                        $lt: exitTime
                    }
                });
                resolve(customers);
            } catch (err) {
                console.log(err);
                resolve([]);
            }
        });
    },

    GET_ONE_CUSTOMER: (name, id, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let customer = await CustomersSchema.findOne({ _id: ObjectId(id), name, userId });
                resolve(customer);
            } catch (err) {
                console.log(err);
                resolve({});
            }
        });
    },

    GET_FILTER_CUSTOMERS: (id, userId) => {
        return new Promise(async (resolve, reject) => {
            let resolved_data = null;
            try {
                let filtedCustomers = await CustomersSchema.aggregate([
                    {
                        $match: { _id: ObjectId(id), userId: ObjectId(userId) }
                    },
                    {
                        $project: {
                            entryTime: 1,
                            exitTime: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "customers",
                            let: { entry_time: "$entryTime", exit_time: "$exitTime" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $or: [
                                                {
                                                    // to get csutomers in between the entry and exit time of the deseaced customer.
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$exitTime"] },
                                                        { $gt: ["$entryTime", "$$entry_time"] }
                                                    ]
                                                },
                                                {
                                                    // to get csutomers already in the shop when the deseaced customer came.
                                                    $and: [
                                                        { $gt: ["$exitTime", "$$exit_time"] },
                                                        { $gt: ["$$entry_time", "$entryTime"] }
                                                    ]
                                                },
                                                {
                                                    // to get csutomers came after the deseaced customer.
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$entryTime"] },
                                                        { $gt: ["$entryTime", "$$entry_time"] }
                                                    ]
                                                },
                                                {
                                                    // to get csutomers came before the deseaced customer.
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$exitTime"] },
                                                        { $gt: ["$exitTime", "$$entry_time"] }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "inContact"
                        }
                    },
                    {
                        $unwind: "$inContact"
                    },
                    {
                        $lookup: {
                            from: "sms_collection",
                            let: { inContact: "$inContact" },
                            pipeline: [
                                {
                                    $project: {
                                        _id: "$$inContact._id",
                                        name: "$$inContact.name",
                                        phone: "$$inContact.phone",
                                        place: "$$inContact.place",
                                        entryTime: "$$inContact.entryTime",
                                        exitTime: "$$inContact.exitTime",
                                        smsStatus: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
                                                                "$day"
                                                            ]
                                                        },
                                                        {
                                                            $eq: [
                                                                ObjectId(userId),
                                                                "$userId"
                                                            ]
                                                        },
                                                        {
                                                            $in: ["$$inContact.phone", "$smsStatus.to"]
                                                        }
                                                    ]
                                                },
                                                true,
                                                false
                                            ]
                                        }
                                    }
                                }
                            ],
                            as:"inContact"
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            inContact: { $push: { $first: "$inContact" } }
                        }
                    }
                ]);
    
                if (filtedCustomers) {
                    resolved_data = {
                        customers: filtedCustomers[0].inContact,
                        customers_length: filtedCustomers[0].inContact.length
                    }
                };
            } catch (err) {
                resolved_data = {
                    customers: [],
                    customers_length: 0
                }
            }
            resolve(resolved_data);
        });
    },

    GET_MORE_FILTER_CUSTOMER: (ids, userId) => {
        return new Promise(async (resolve, reject) => {
            // all the string of ids is converting in to array of ids.
            let ids_array = ids.split(",");

            // create the ordianry array of ids in to array of objectId's.
            let obj_ids_array = Array.from(ids_array, id => ObjectId(id));

            // creating all the object Id array in to array of "{ _id: <id> }" fation to find all the customers in contact with all the deceased customers.
            let id_for_match_data = [];
            obj_ids_array.forEach((id) => id_for_match_data.push({ _id: id }));

            let customers = null;
            try {
                // find all the in related contact customers.
                customers = await CustomersSchema.aggregate([
                    {
                        $match: {
                            userId: ObjectId(userId),
                            $or: id_for_match_data
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            entryTime: 1,
                            exitTime: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "customers",
                            let: { entry_time: "$entryTime", exit_time: "$exitTime" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $or: [
                                                {
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$exitTime"] },
                                                        { $gt: ["$entryTime", "$$entry_time"] }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { $gt: ["$exitTime", "$$exit_time"] },
                                                        { $gt: ["$$entry_time", "$entryTime"] }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$entryTime"] },
                                                        { $gt: ["$entryTime", "$$entry_time"] }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        { $gt: ["$$exit_time", "$exitTime"] },
                                                        { $gt: ["$exitTime", "$$entry_time"] }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "inContact"
                        }
                    },
                    {
                        $unwind: "$inContact"
                    },
                    {
                        $lookup: {
                            from: "sms_collection",
                            let: { inContact: "$inContact" },
                            pipeline: [
                                {
                                    $project: {
                                        _id: "$$inContact._id",
                                        name: "$$inContact.name",
                                        phone: "$$inContact.phone",
                                        place: "$$inContact.place",
                                        entryTime: "$$inContact.entryTime",
                                        exitTime: "$$inContact.exitTime",
                                        smsStatus: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
                                                                "$day"
                                                            ]
                                                        },
                                                        {
                                                            $eq: [
                                                                ObjectId(userId),
                                                                "$userId"
                                                            ]
                                                        },
                                                        {
                                                            $in: ["$$inContact.phone", "$smsStatus.to"]
                                                        }
                                                    ]
                                                },
                                                true,
                                                false
                                            ]
                                        }
                                    }
                                }
                            ],
                            as:"inContact"
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            allCustomers: {
                                $push: { $first: "$inContact" }
                            }
                        }
                    }
                ]);
            } catch (err) {
                console.log(err)
                resolve({ customers: [], customers_length: 0 });
            }

            let allCustomers = customers[0].allCustomers;

            customers = filterDuplicateCustomers(allCustomers, ids_array);
            let resovle_data = {
                customers,
                customers_length: customers.length
            };

            resolve(resovle_data);
        });
    },

    GET_ONE_CUSTOMER_SMS: ({ id, userId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                // findind the corresponding customers phone number and name to send sms by id.
                let customer = await CustomersSchema.findById(id, { name: 1, phone: 1 });

                if (!customer)
                    return resolve({ rtnSMSstatus: false, customer: { name: 'unknown name', phone: 'unknown phone number' } });

                // sending sms.
                let body = `Hi ${customer.name}, \nYou are in a contact with a deceased customer.`;
                let rtnSMSstatus = await sms.SND_SMS(customer.phone, body);

                if (!rtnSMSstatus.sid)
                    return resolve({ rtnSMSstatus: false, customer });
                
                // creating a document that stores the sms status each day based. If there is already one it will updates it.
                body = await SMS_Schema.findOneAndUpdate(
                    {
                        userId,
                        day: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                    },
                    {
                        "$push": {
                            "smsStatus": {
                                sid: rtnSMSstatus.sid,
                                to: rtnSMSstatus.to,
                                dateCreated: rtnSMSstatus.dateCreated
                            }
                        }
                    },
                    {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    }
                );

                return resolve({ rtnSMSstatus: true, customer });
                
            } catch (err) {
                console.error(err);
                return resolve({ rtnSMSstatus: false, customer: { name: 'unknown name', phone: 'unknown phone number' } });
            }
        });
    }
}

// filtering duplicate customers
function filterDuplicateCustomers(allCustomers, deceasedIds) {
    let filteredCustomers = allCustomers.reduce((accumalator, current) => {
        if (! accumalator.some(item => item._id.toString() === current._id.toString() || deceasedIds.includes(current._id.toString()) )) {
            accumalator.push(current);
        }
        return accumalator;
    }, []);

    return filteredCustomers;
}