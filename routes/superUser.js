const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

// admin schema
const AdminSchema = require('../models/Admin');

// super user helper.
const SuperUserHelper = require('../helper/SuperUserHelper');

// middleware
const { IS_SUPER_USER, IS_SUPER_IN } = require('../middlewares/auth');


// @desc        For getting profile template.
// @rout        GET /superUser
router.get('/', IS_SUPER_USER, async (req, res) => {
    let render_data = {
        main_title: "SMR BoT | SU Dashboard",
        layout: 'super-user/super-user',
        path: [
            {
                main: true,
                title: "Dashboard",
                path: "/superUser"
            }
        ],
        total_users: await SuperUserHelper.TOTAL_USERS(),
        total_customers: await SuperUserHelper.TOTAL_CUSTOMERS()
    }
    res.render('superUser/dashboard', render_data);
});


// @desc        For getting all users.
// @rout        GET /superUser/users
router.get('/users', IS_SUPER_USER, async (req, res) => {
    let admin = await SuperUserHelper.GET_ADMINS();
    let render_data = {
        main_title: "SMR BoT | SU Users",
        layout: 'super-user/super-user',
        path: [
            {
                main: false,
                title: "Dashboard",
                path: "/superUser"
            },
            {
                main: true,
                title: "Users",
            },
        ],
        admin
    }
    res.render('superUser/users', render_data);
});


// @desc        For showing one user.
// @rout        GET /superUser/viewUser/:id
router.get('/viewUser/:id', IS_SUPER_USER, async (req, res) => {
    let admin = await SuperUserHelper.GET_ONE_ADMIN(req.params.id);
    let render_data = {
        main_title: "SMR BoT | SU View User",
        layout: 'super-user/super-user',
        path: [
            {
                main: false,
                title: "Dashboard",
                path: "/superUser"
            },
            {
                main: false,
                title: "Users",
                path: "/superUser/Users"
            },
            {
                main: true,
                title: `${admin.name} <span style="font-size: 12px;">(view)</span>`,
            },
        ],
        admin,
        view: true,
        district: [
            "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam", "Idukki", "Ernakulam",
            "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
        ]
    }
    res.render('superUser/viewUser', render_data);
});


// @desc        For showing one user.
// @rout        GET /superUser/editUser/:id
router.get('/editUser/:id', IS_SUPER_USER, async (req, res) => {
    let admin = await SuperUserHelper.GET_ONE_ADMIN(req.params.id);

    if (!admin) {
        req.flash("error", "No admin found");
        return res.redirect('/superUser/users');
    }

    let render_data = {
        main_title: "SMR BoT | SU Edit User",
        layout: 'super-user/super-user',
        path: [
            {
                main: false,
                title: "Dashboard",
                path: "/superUser"
            },
            {
                main: false,
                title: "Users",
                path: "/superUser/Users"
            },
            {
                main: true,
                title: `${admin.name} <span style="font-size: 12px;">(edit)</span>`,
            },
        ],
        admin,
        district: [
            "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam", "Idukki", "Ernakulam",
            "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
        ]
    }
    return res.render('superUser/viewUser', render_data);
});


// @desc        For showing one user.
// @rout        POST /superUser/editUser/:id
router.post('/editUser/:id', IS_SUPER_USER, async (req, res) => {
    let admin = await SuperUserHelper.EDIT_USER(req.params.id, req.body);
    
    if (!admin) {
        req.flash("error", "Update failed.");
    }

    res.redirect(`/superUser/viewUser/${req.params.id}`);
});


// @desc        For getting addUser template.
// @rout        GET /superUser/addUser
router.get('/addUser', IS_SUPER_USER, (req, res) => {
    const code = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let pass = "";
    let passLength = 6;

    for (let i = 1; i <= passLength; i++){
        let num = Math.floor(Math.random() * code.length);
        pass += code[num];
    }

    let render_data = {
        main_title: "SMR BoT | SU Add User",
        layout: 'super-user/super-user',
        path: [
            {
                main: false,
                title: "Dashboard",
                path: "/superUser"
            },
            {
                main: true,
                title: "Add Users",
            },
        ],
        district: [
            "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam", "Idukki", "Ernakulam",
            "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
        ],
        pass
    }

    res.render('superUser/addUser', render_data);
});


// @desc        For getting login template.
// @rout        POST /superUser/addUser
router.post('/addUser', IS_SUPER_USER, async (req, res) => {
    let superUser = await SuperUserHelper.ADD_ADMIN(req.body);

    if (!superUser.status) {
        req.flash("error", superUser.msg)
        return res.redirect(`/superUser/addUser`);
    }

    if (superUser.email)
        req.flash("sucess_msg", superUser.sucess_msg);
    else
        req.flash("error", superUser.msg);

    return res.redirect(`/superUser/viewUser/${superUser.data._id}`);
});


// @desc        For getting login template.
// @rout        GET /superUser/addUser/:id
router.get('/removeUser/:id', IS_SUPER_USER, async (req, res) => {
    let superUser = await SuperUserHelper.REMOVE_ADMIN(req.params.id);

    if (!superUser.status)
        req.flash("error", superUser.msg)
    
    if (superUser.status)
        req.flash("sucess_msg", superUser.msg);

    res.redirect(`/superUser/users`);
});


// @desc        For getting login template.
// @rout        GET /superUser/profile
router.get('/profile', IS_SUPER_USER, (req, res) => {
    let render_data = {
        main_title: "SMR BoT | SU Profile",
        layout: 'super-user/super-user',
        path: [
            {
                main: false,
                title: "Dashboard",
                path: "/superUser"
            },
            {
                main: true,
                title: "Profile",
            },
        ],
        superUser: req.user
    }
    res.render('superUser/profile', render_data);
});


// @desc        For getting login template.
// @rout        GET /superUser/login
router.get('/login', IS_SUPER_IN, (req, res) => {
    res.render('superUser/login', { layout: 'super-user/login' });
});


// @desc        For login.
// @rout        POST /superUser/login
router.post('/login', IS_SUPER_IN, passport.authenticate('superUser',
    {
        successRedirect: '/superUser',
        failureRedirect: '/superUser/login',
        failureFlash: true
    }
));


// @desc        For getting profile template.
// @rout        GET /create-client
router.post('/create-client', IS_SUPER_USER, async(req, res) => {
    let client = req.body;

    try {
        client.password = await bcrypt.hash(client.password, 10);
    } catch (err) {
        res.send(err);
    }
    client.createdTime = new Date();
    AdminSchema.create(client)
        .then(res => res.send(res))
        .catch(err => res.send(err))
    
});


// @desc        For logout.
// @rout        POST /superUser/logout
router.get('/logout', IS_SUPER_USER, (req, res) => {
    console.log(req.user);
    req.logOut();
    res.redirect("/superUser/login");
});


module.exports = router;