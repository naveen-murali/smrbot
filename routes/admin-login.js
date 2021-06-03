const express = require('express');
const passport = require('passport');
const router = express.Router();

// middleware for autherization
const { IS_GUEST, IS_USER_IN } = require('../middlewares/auth');

// admin helper
const AdminHelper_login = require('../helper/AdminHelper-login');


// @desc        For getting login template.
// @rout        GET /admin/login
router.get('/', IS_USER_IN, (req, res) => {
    req.flash('googleId');
    req.flash('googleImg');
    res.render('login', { layout: 'login-layout', mainTitle: 'SMR BoT | Log in', });
});


// @desc        For password login.
// @rout        POST /admin/login/local
router.post('/local', IS_USER_IN,
    passport.authenticate('admin',
        {
            successRedirect: '/',
            failureRedirect: '/admin/login',
            failureFlash: true
        }
    )
);


// @desc        Directing to google to get information key.
// @rout        GET /admin/login/google
router.get('/google', IS_USER_IN,
    passport.authenticate('google',
        {
            scope: ['profile', 'email']
        }
    )
);


// @desc        Geting information based on information key.
// @rout        GET /admin/login/google/redirect
router.get('/google/redirect', IS_USER_IN,
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/admin/login/check-google',
        failureFlash: true
    })
);


// @desc        To check and link unliked google account to matched account.
// @rout        GET /admin/login/check-google
router.get('/check-google', IS_USER_IN, (req, res) => {
    try {
        let matchData = JSON.parse(res.locals.error_msg);
        req.flash("googleId");
        req.flash("googleImg");
        req.flash("googleId", matchData.googleId);
        req.flash("googleImg", matchData.googleImg);
        res.render('link-google', { layout: 'login-layout', mainTitle: 'SMR BoT | Add Google Account', email: matchData.email });
    } catch (err) {
        req.flash("error");
        req.flash("error", res.locals.error_msg);
        res.redirect('/admin/login');
    }
});


// @desc        Varifing the user.
// @rout        POST /admin/login/google2
router.post('/google2', IS_USER_IN, (req, res, next) => {
    passport.authenticate('admin',
        {
            successRedirect: '/admin/login/google2/varified',
            failureRedirect: '/admin/login',
            failureFlash: true
        }
    )(req, res, next);
});


// @desc        Linking the unliked google account to SMR BoT account and loging in.
// @rout        GET /admin/login/google2
router.get('/google2/varified', IS_GUEST, (req, res) => {
    AdminHelper_login.ADD_GOOGLE_ID(req.flash('googleId')[0], req.flash('googleImg')[0], req.user._id)
        .then((data) => {
            if (data)
                res.redirect('/');
            else{
                req.logOut()
                req.flash('error', 'could not complete the task.');
                res.redirect('/admin/login');
            };
        });
});


// @desc        Getting email id from the client and find the account with it and giving it to confirm.
// @rout        GET /admin/login/changePass
router.post('/changePass', IS_GUEST, async (req, res) => {
    if (!(req.body.currentPasssword || req.body.newPassword || req.body.casssword)) {
        req.flash('error', "Please provide all details.");
        return res.redirect('/admin/profile');
    }

    let changeStatus = await AdminHelper_login.CREATE_NEW_PASSWORD(req.body, req.user);

    if (changeStatus.status) {
        req.user._id = changeStatus.newId;
        req.flash('sucess_msg', changeStatus.sucess_msg);
        return res.redirect('/admin/profile');
    }

    req.flash('error', changeStatus.error_msg);
    return res.redirect('/admin/profile');
});


// @desc        Getting email id from the client and find the account with it and giving it to confirm.
// @rout        GET /admin/login/forgot-password
router.get('/forgot-password', IS_USER_IN, async (req, res) => {
    let user = await AdminHelper_login.GET_USER_BY_EMAIL(req.query.email);

    if (user.length == 0) {
        req.flash('error', 'Account Not Found.');
        return res.redirect('/admin/login');
    }

    res.render('login-forgot', { layout: 'login-layout', mainTitle: 'SMR BoT | Confirm Account', forgotAcc: user });
});


// @desc        Get the confirmed email from the client and send the otp to email and phone give back the template to get the otp.
// @rout        GET /admin/login/confirm-account/:id
router.get('/confirm-account/:id', IS_USER_IN, async (req, res) => {
    let user = await AdminHelper_login.GET_USER_BY_ID(req.params.id);

    if (!user) {
        req.flash('error', 'User not Found.');
        return res.redirect('/admin/login');
    }

    let otp_status = await AdminHelper_login.SEND_OTP(user);

    if (!otp_status.status){
        req.flash('error', "Couldn't send the OTP.")
        return res.redirect('/admin/login');
    }

    let form = {
        action: `/admin/login/confirm-otp/${req.params.id}`,
        method: 'post',
        input_1: {
            type: 'number',
            icon: 'keyboard',
            name: 'phoneOTP',
            placeholder: 'OTP from phone'
        },
        input_2: {
            type: 'number',
            icon: 'keyboard',
            name: 'emailOTP',
            placeholder: 'OTP from email'
        },
        submit: {
            value: 'Confirm OTP',
            icon: 'vpn_key'
        }
    }
    return res.render('login-forgot', { layout: 'login-layout', mainTitle: 'SMR BoT | Confirm OTP', form });
});


// @desc        Confirming the OTP and send the change send template for getting new password.
// @rout        GET /admin/login/confirm-otp/:id
router.post('/confirm-otp/:id', IS_USER_IN, async (req, res) => {
    let matchOTP = await AdminHelper_login.MATCH_OTP(req.body, req.params.id);

    if (!matchOTP) {
        req.flash('error', 'OTP expired');
        return res.redirect('/admin/login');
    }

    let form = {
        action: `/admin/login/change-password/${req.params.id}`,
        method: 'post',
        input_1: {
            type: 'password',
            icon: 'password',
            name: 'password',
            placeholder: 'Password'
        },
        input_2: {
            type: 'password',
            icon: 'password',
            name: 'cPassword',
            placeholder: 'Confirm Password'
        },
        submit: {
            value: 'Confirm Paasword',
            icon: 'lock'
        }
    };
    return res.render('login-forgot', { layout: 'login-layout', mainTitle: 'SMR BoT | Change Password', form });
});


// @desc        Confirming the OTP and send the change send template for getting new password.
// @rout        GET /admin/login/confirm-otp/:id
router.post('/change-password/:id', IS_USER_IN, async(req, res) => {
    if (!(req.body.password === req.body.cPassword)) {
        req.flash('error', 'Password varification failed');
        return res.redirect('/admin/login');
    }
    let changePassword = await AdminHelper_login.CHANGE_PASSWORD(req.body.password, req.params.id);
    if (!changePassword){
        req.flash('error', 'Failed to change the password');
        return res.redirect('/admin/login')
    }
    req.flash('sucess_msg', 'password success fully changed');
    req.flash('sucess_msg', 'PLAESE LOGIN WITH YOUR NEW PASSWORD');
    res.redirect('/admin/login')
});

module.exports = router;