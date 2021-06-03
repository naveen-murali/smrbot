const express = require('express');
const { route } = require('./admin');
const router = express.Router();

const CustomerHelper = require('../helper/CustomersHelper');

// @desc        Home.
// @rout        GET /customersWarning/:ids
router.get('/:ids', async (req, res) => {
    let data = req.params.ids.match(/^([\d\w]{24})([\d\w]{24})$/);

    let userId = data[1];
    let customerId = data[2];
    
    data = await CustomerHelper.FIND_CUSTOMER(userId, customerId);
    
    if (data){
        req.flash("customersWarning", "here")
        return res.render('customers/view', { layout: 'customersWarning', info: true, customer: data, userId, ids: req.params.ids });
    } else
        return res.render('customers/view', { layout: 'customersWarning', error: true, noBtns: true });
});


// @desc        Home.
// @rout        GET /customersWarning/:ids
router.get('/sendWarning/:userId/:customerId', async (req, res) => {
    if (req.flash("customersWarning").length === 0)
        return res.render('customers/view', { layout: 'customersWarning', error: true, noBtns: true });
    
    if (await CustomerHelper.SEND_ALERT(req.params.userId, req.params.customerId))
        return res.render('customers/view', {
            layout: 'customersWarning',
            success: true, ids: req.params.ids
        });
    
    return res.render('customers/view', {
        layout: 'customersWarning',
        error: true, userId: req.params.userId, customerId: req.params.customerId
    });
});

module.exports = router;