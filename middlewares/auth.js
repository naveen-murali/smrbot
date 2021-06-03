module.exports = {
    IS_GUEST: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "admin")
            next();
        else
            res.redirect('/admin/login');
    },

    IS_USER_IN: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "admin")
            res.redirect('/admin');
        else
            next();
    },

    IS_SUPER_USER: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "superuser")
            next();
        else
            res.redirect('/superUser/login');
    },

    IS_SUPER_IN: (req, res, next) => {
        if (req.isAuthenticated() && req.user.status === "superuser")
            res.redirect('/superUser');
        else
            next();
    },
}