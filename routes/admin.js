const express = require('express');
const router = express.Router();

// admin helper customer related usage for Admin.
const AdminHelper_customer = require('../helper/AdminHelper-customers');
// admin helper for login and related purpose for Admin
const AdminHelper_login = require('../helper/AdminHelper-login');
// middleware for autherization
const { IS_GUEST } = require('../middlewares/auth');


// @desc        Home.
// @rout        GET /admin
router.get('/', IS_GUEST, async (req, res) => {
    let { total_customer, new_customer, new_alerts_count } = await AdminHelper_customer.GET_CUSTOMERS_LENG(req.user._id);

    let render_data = {
        mainTitle: 'SMR BoT | Dashboard',
        total_customer,
        new_customer,
        new_alerts_count,
        profile: req.user
    };

    res.render('home', render_data);
});


// @desc        For Chart Data Through AJAX call.
// @rout        GET /admin/getChartData
router.get('/getChartData', async (req, res) => {
    let { data, label } = await AdminHelper_customer.GET_CHART_DATA(req.user._id);

    let json_data = { data, label };

    res.json(json_data);
});


// @desc        For notification and alerts.
// @rout        GET /admin/notificationAlert
router.get('/notificationAlert', IS_GUEST, async (req, res) => {
    let { new_alerts, new_alerts_count, old_alerts } = await AdminHelper_customer.GET_ALERTS(req.user._id);
    let render_data = {
        mainTitle: 'SMR BoT | Notifications & Alerts',
        path: [
            {
                path: '/profile',
                viewTitle: 'profile'
            }
        ],
        new_alerts,
        new_alerts_count,
        old_alerts,
        profile: req.user
    };
    res.render('notifAndAlerts', render_data)
});


// @desc        For getting profile template.
// @rout        GET /admin/profile
router.get('/profile', IS_GUEST, async (req, res) => {
    let render_data = {
        mainTitle: 'SMR BoT | Profile',
        path: [
            {
                path: '/profile',
                viewTitle: 'profile'
            }
        ],
        new_alerts_count: await AdminHelper_customer.GET_NEW_ALERTS(req.user._id),
        profile: req.user
    };
    req.flash('name', "req.user.name");

    res.render('profile', render_data);
});


// @desc        Editing profile.
// @rout        POST /admin/editProfile
router.post('/editProfile', IS_GUEST, async (req, res) => {
    if (req.files) {
        let profileImg = req.files.profileImg;
        let ext = profileImg.mimetype.match(/([\w]+)$/g);
        profileImg.mv(`./public/profile-images/${req.user._id}.${ext}`, async (err, done) => {
            if (err)
                return res.redirect('/admin/profile');
    
            let editStatus = await AdminHelper_login.EDIT_PROFILE(req.body, req.user._id, `/profile-images/${req.user._id}.${ext}`, 'addToLocal');
    
            if (editStatus.status) {
                req.user.name = editStatus.editRes.name;
                req.user.phone = editStatus.editRes.phone;
                req.user.email = editStatus.editRes.email;
                req.user.address = editStatus.editRes.address;
                req.user.localImg = editStatus.editRes.localImg;
                req.user.profileImg = editStatus.editRes.profileImg;
            }
    
            return res.redirect('/admin/profile');
        });
    }

    let editStatus = await AdminHelper_login.EDIT_PROFILE(req.body, req.user._id, req.user.googleImg, false );
    
    if (editStatus.status) {
        req.user.name = editStatus.editRes.name;
        req.user.phone = editStatus.editRes.phone;
        req.user.email = editStatus.editRes.email;
        req.user.address = editStatus.editRes.address;
        req.user.profileImg = editStatus.editRes.profileImg;
    }

    return res.redirect('/admin/profile');
});


// @desc        Changing the profile to google images.
// @rout        GET /admin/changeProfileGoogle
router.get('/changeProfileGoogle', IS_GUEST, (req, res) => {
    AdminHelper_login.PROFILE_IMG_TO_GOOGLE(req.user)
        .then((response) => {
            if (response.status)
                req.user.profileImg = req.user.googleImg;
            
            res.redirect('/admin/profile');
        });
});


// @desc        Changing the profile to local images.
// @rout        GET /admin/changeProfileLocal
router.get('/changeProfileLocal', IS_GUEST, (req, res) => {
    AdminHelper_login.PROFILE_IMG_TO_LOCAL(req.user)
        .then((response) => {
            if (response.status)
                req.user.profileImg = req.user.localImg;
            
            res.redirect('/admin/profile');
        });
});


// @desc        For getting profile template.
// @rout        GET /admin/logout
router.get('/logout', IS_GUEST, (req, res) => {
    req.logout();
    res.redirect('/admin/login');
});

module.exports = router;