const passport = require("passport");
const GoogleStratergy = require("passport-google-oauth20");
const LocalStratergy = require('passport-local');
const bcrypt = require('bcrypt');

// Admin schema
const AdminSchema = require('../models/Admin');
// Super user schema
const SuperUserSchema = require('../models/SuperUser');


passport.serializeUser((err, user, done) => {
    done(null, { id: user.id, status: user.status });
});
passport.deserializeUser(async(data, done) => {
    if (data.status === "admin")
        AdminSchema.findByIdAndUpdate(
            data.id, { lastLogin: new Date() }, { new: true },
            (err, user) => {
                user.status = data.status;
                return done(err, user);
            }
        );
    
    if (data.status === "superuser")
        SuperUserSchema.findByIdAndUpdate(
            data.id, { lastLogin: new Date() }, { new: true },
            (err, user) => {
                user.status = data.status;
                return done(err, user);
            }
        );
});


// google sratergy for login with google.
passport.use(
    new GoogleStratergy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/admin/login/google/redirect'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await AdminSchema.findOne({ email: profile.emails[0].value });

                if (!user)
                    return done(null, false, { message: "Email is not registered" });

                if (user.googleId === profile.id) {
                    user.status = "admin";
                    return done(null, user);
                }
                
                // return done(null, false, { message: `match-${profile.id}-${user._id}` });
                return done(null, false, { message: JSON.stringify({ id: user._id, email: user.email, googleId: profile.id, googleImg: profile.photos[0].value }) });
            } catch (err) {
                return done(err, null);
            }
        })
);

// local stratergy for password login for admin.
passport.use(
    "admin",
    new LocalStratergy(async (username, password, done) => {
        try {
            let user = await AdminSchema.findOne({ email: username });
            
            if (user) {
                bcrypt.compare(password, user.password, (err, status) => {
                    if (err) return done(err, false, { massage: 'Failed to varify the password.' });
                    
                    // updating last login.
                    if (status) {
                        AdminSchema.findOneAndUpdate(
                            { email: username }, { lastLogin: new Date() }
                        ).catch(err => console.error(err));
                        
                        user.status = "admin";

                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            } else {
                return done(null, false, { message: 'Incorrect email.' });
            }

        } catch (err) {
            return done(err, null, {massage: 'Failed to find the user.'});
        }
    })
);

// super user stratergy for password login for admin.
passport.use(
    "superUser",
    new LocalStratergy(async (username, password, done) => {
        try {
            let user = await SuperUserSchema.findOne({ email: username });
            
            if (user) {
                bcrypt.compare(password, user.password, (err, status) => {
                    if (err) return done(err, false, { massage: 'Failed to varify the password.' });
                    
                    // updating last login.
                    if (status) {
                        SuperUserSchema.findOneAndUpdate(
                            { email: username }, { lastLogin: new Date() }
                        ).catch(err => console.error(err));
                        
                        user.status = "superuser";

                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            } else {
                return done(null, false, { message: 'Incorrect email.' });
            }

        } catch (err) {
            return done(err, null, {massage: 'Failed to find the user.'});
        }
    })
);