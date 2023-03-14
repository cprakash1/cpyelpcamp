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

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})






app.use('/campground',campgroundrouter)
app.use('/campground/:id/reviews',reviewrouter)


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