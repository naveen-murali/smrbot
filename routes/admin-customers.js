const express = require('express');
const router = express.Router();

// admin helper
const AdminHelper_customer = require('../helper/AdminHelper-customers');

// middleware for autherization
const { IS_GUEST } = require('../middlewares/auth');

// @desc        For getting customers search template.
// @rout        GET /customers
router.get('/', IS_GUEST, async (req, res) => {
    let render_data = {
        mainTitle: 'SMR BoT | Search Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id)
    };

    res.render('customers-search', render_data);
});


// @desc        For getting all customers.
// @rout        GET /customers/all-customers
router.get('/all-customers', IS_GUEST, async (req, res) => {
    let customers = await AdminHelper_customer.GET_CUSTOMERS(req.user._id);
    let render_data = {
        mainTitle: 'SMR BoT | All Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: '/admin/customers/all-customers',
                viewTitle: 'customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers,
        autocomplete: true
    };

    res.render('customer', render_data);
});


// @desc        Show By Name - form submission.
// @rout        GET /customers/search-by-name
router.get('/show-by-name', IS_GUEST, async (req, res) => {
    let name = req.query.name;

    let customers = await AdminHelper_customer.SEARCH_BY_NAME(req.user._id, name);

    let render_data = {
        mainTitle: 'SMR BoT | Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/show-by-name?name=${name}`,
                viewTitle: 'customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers
    };

    res.render('customer', render_data);
});


// @desc        Search by special key - form submission.
// @rout        GET /customers/search-special-key
router.get('/search-special-key', IS_GUEST, async (req, res) => {
    let id = req.query.id;
    let render_data = {
        mainTitle: 'SMR BoT | Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/search-special-key?id=${id}`,
                viewTitle: 'customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers: await AdminHelper_customer.SEARCH_BY_ID(req.user._id, id)
    };

    res.render('customer', render_data);
});


// @desc        Search by full details - form submission.
// @rout        GET /customers/search-by-full
router.get('/search-by-full', IS_GUEST, async (req, res) => {
    let render_data = {
        mainTitle: 'SMR BoT | Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers`,
                viewTitle: 'customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers: await AdminHelper_customer.SEARCH_BY_FULL(req.user._id, req.query)
    };

    res.render('customer', render_data);
});


// @desc        Search by full details - form submission.
// @rout        GET /customers/search-by-date
router.get('/search-by-date', IS_GUEST, async (req, res) => {
    let render_data = {
        mainTitle: 'SMR BoT | Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/search-by-date?date=${req.query.date}`,
                viewTitle: 'customers'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers: await AdminHelper_customer.SEARCH_BY_DATE(req.user._id, req.query.date),
        autocomplete: true
    };

    res.render('customer', render_data);
});


// @desc        Autocompeltion call.
// @rout        GET /customers/search/data
router.get('/search/:data', IS_GUEST, async (req, res) => {
    let resData = {
        autocompleteData: await AdminHelper_customer.GET_SEARCH_DATA(req.params.data)
    };
    res.status(200).json(resData);
});


// @desc        Giveing one customer that matches the data.
// @rout        GET /getCustomer/:name/:id
router.get('/getCustomer/:name/:id', IS_GUEST, async (req, res) => {
    let resData = {
        tableData: await AdminHelper_customer.GET_ONE_CUSTOMER(req.params.name, req.params.id, req.user._id)
    };
    res.status(200).json(resData);
});


// @desc        For getting all customers those who in contact with only one customer at a time.
// @rout        GET /customers/oneCustomerFilter/:id
router.get('/oneCustomerFilter/:id', IS_GUEST, async (req, res) => {
    let { customers, customers_length } = await AdminHelper_customer.GET_FILTER_CUSTOMERS(req.params.id, req.user.id);
    let render_data = {
        mainTitle: 'SMR BoT | Possible Contact Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/oneCustomerFilter/${req.params.id}`,
                viewTitle: 'customer filter'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers,
        customers_length
    };

    res.render('customerFilter', render_data);
});


// @desc        For getting all customers those who in contact with only more that one customer at a time.
// @rout        POST /customers/manyCustomerFilter
router.post('/manyCustomerFilter', IS_GUEST, async (req, res) => {
    let { customers, customers_length } = await AdminHelper_customer.GET_MORE_FILTER_CUSTOMER(req.body.deceasedCustomers, req.user.id);

    let render_data = {
        mainTitle: 'SMR BoT | Possible Contact Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/manyCustomerFilter/${req.body.deceasedCustomers}`,
                viewTitle: 'customer Filter'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers,
        customers_length
    };

    res.render('customerFilter', render_data);
});


// @desc       For getting all customers those who in contact with only one customer at a time.
// @rout        GET /customers/manyCustomerFilter/:ids
router.get('/manyCustomerFilter/:ids', IS_GUEST, async (req, res) => {
    let { customers, customers_length } = await AdminHelper_customer.GET_MORE_FILTER_CUSTOMER(req.params.ids, req.user.id);

    let render_data = {
        mainTitle: 'SMR BoT | Possible Contact Customers',
        path: [
            {
                path: '/admin/customers',
                viewTitle: 'search customers'
            },
            {
                path: `/admin/customers/manyCustomerFilter/${req.params.ids}`,
                viewTitle: 'customer Filter'
            }
        ],
        profile: req.user,
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        customers,
        customers_length
    };

    res.render('customerFilter', render_data);
});


// @desc        For sending sms to filtered customer. 
// @rout        GET /customers/sndSms/:id
router.get('/sndSms/:id/:userId', IS_GUEST, async (req, res) => {
    let res_data = {};

    let { rtnSMSstatus, customer } = await AdminHelper_customer.GET_ONE_CUSTOMER_SMS(req.params);

    res_data = {
        status: rtnSMSstatus,
        name: customer.name,
        phone: customer.phone
    };

    res.status(200).json(res_data);
});

module.exports = router;