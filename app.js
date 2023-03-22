const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 80;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError');
// const ExpressError = require('./utils/expressError');
const campgroundrouter=require('./routes/campground')
const reviewrouter=require('./routes/review')
const authrouter=require('./routes/auth')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const localStratigy=require('passport-local')
const User=require('./model/user')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // strictQuery:true
    // useCreateIndex:true
    // useFindAndModify:true
});
const db = mongoose.Connection;
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once("open", () => {
    console.log('Database Connected');
});

//  note while using router params of each routes get seperated so if app page contain /home/:id
// and router page try to access that id then it cannot so in order to access that make mergeparams:true


app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const sessionopt={
    secret:'thisisnotagoodsecret',
    resave:false,
    saveUnitialized:true,
    cookie:{
        httponly:true,
        expires:Date.now()+1000*60*60*24*7,
        age:1000*60*60*24*7
    }
}
app.use(session(sessionopt))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStratigy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use((req, res, next) => {
    console.log(req.url, req.method);
    console.log(req.session)
    // console.log(req.user)
    next();
})

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user;
    next()
})

app.use('/campground',campgroundrouter)
app.use('/campground/:id/reviews',reviewrouter)
app.use('/',authrouter)

app.all('*', (req, res, next) => {
    next(new expressError("Page Not Found", 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('error', { err, title: statusCode });
    console.log(err.name);
})


app.listen(port, () => {
    console.log('http://127.0.0.1:80/campground')
})