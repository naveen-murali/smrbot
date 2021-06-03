const createError = require("http-errors");
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const redis = require('redis');
const session = require('express-session');
const flash = require('connect-flash');

// creating a redis store by passing session AND creating a redis store
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
// logging redis error
if (process.env.NODE_ENV == 'development')
    redisClient.on('error', console.error);


// configuring dotenv to make environmental variables.
dotenv.config({ path: './config/config.env' });


//! Global calling of loacal functions.------------------------------------------------------------------------------------------------------------
// passport setup
const passportSetUp = require('./config/passport');

// Establishing the connection b/w mongoDB.
const connectDB = require('./config/connectDB');
connectDB();

// Establishing the connection b/w twilio.
const twilio = require('./helper/sms');
twilio.CONNECT();
//! -----------------------------------------------------------------------------------------------------------------------------------------------


//! CREATING EXPRESS APP---------------------------------------------------------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT | 3000;

// setting logging in development mode.
if (process.env.NODE_ENV == 'development')
    app.use(morgan('dev'));


// To enable form submission.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// setting static folder.
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileUpload());


// setting view engine.
app.engine(
    '.hbs',
    hbs({
        defaultLayout: 'main',
        extname: '.hbs',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        },
        helpers: {
            formatDate: (date) => {
                date = new Date(date);
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                return `${date.getDate()}<sup>th</sup> ${months[date.getMonth()]} ${date.getFullYear()}`;
            },
            formatPhone: (phoneNum) =>{
                return "+91"+phoneNum;
            },
            toLowerCase: (district) => {
                return district.toLowerCase();
            },
            captalize: (district) => {
                return district.charAt(0).toUpperCase() + district.slice(1);
            }
        }
    })
);
app.set('view engine', '.hbs');

// session middleware.
app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            prefix: 'session'
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        rolling: true,
        saveUninitialized: true,
        cookie: {
            secure: false,  //TODO: set true in production.
            maxAge: 60 * 60 * 1000
        }
    })
);
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}
// handling redis connection.
app.use(function (req, res, next) {
    let sessionMiddleware = session;
    let tries = 3;

    let lookupSession = (error) => {
        if (error)
            return next(error);
        tries -= 1;
        if (req.session !== undefined)
            return next();
        if (tries < 0)
            return next(new Error('redis is not responding'));
    
        sessionMiddleware(req, res, lookupSession)
    }

    lookupSession();
});


// flash middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.error_msg = req.flash('error');
    res.locals.sucess_msg = req.flash('sucess_msg');
    next();
})


// passport middlewares
app.use(passport.initialize());
app.use(passport.session());


// routes.
app.get('/', (req, res) => res.redirect('/admin'));
app.use('/admin', require('./routes/admin'));
app.use('/customersWarning', require('./routes/customer'));
app.use('/superUser', require('./routes/superUser'));
app.use('/admin/customers', require('./routes/admin-customers'));
app.use('/admin/login', require('./routes/admin-login'));


// catch and forwards to the error handler.
app.use((req, res, next) => {
    console.log('Time:', new Date);
    next(createError(404));
});
// error handler.
app.use((err, req, res, next) => {
    // set locals to get error detailes in development mode.
    res.locals.massage = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : { status: err.status };

    // render the error page
    res.status(err.status || 500);
    res.render('error', { layout: "error" , mainTitle: "SMR BoT | Error"});
});

// listening to the port.
app.listen(PORT,
    () => console.log(`----------------Server is started in [${process.env.NODE_ENV}] at PORT [${PORT}]----------------`)
);
//! -----------------------------------------------------------------------------------------------------------------------------------------------