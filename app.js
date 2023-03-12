const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 80;
const Campground = require('./model/campground.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const ExpressError = require('./utils/expressError');
const {campgroundSchema,reviewSchema} = require('./schema');
const Review=require('./model/review')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.Connection;
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once("open", () => {
    console.log('Database Connected');
});



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


const validateCampground = (req, res, next) => {
    const { title, location, price, description, image } = req.body;
    // if (!title || !location || !price || !description || !image) throw new ExpressError('Invalid Campground Data', 400);
    
    const { error } = campgroundSchema.validate({ title, price, image, description, location });
    // console.log(error);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 401);
    }else{
        next();
    }
}

const validatereview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(message,404)
    }else {
        next();
    }
}


app.get('/campground/new', (req, res) => {
    res.status(200).render('new', { title: "New Campground" });
})
app.post('/campground', validateCampground,catchAsync(async (req, res, next) => {
    const { title, location, price, description, image } = req.body;
    const camp = await new Campground({ title, location, price, description, image });
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}))

app.post('/campground/:id/reviews',validatereview,catchAsync(async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campground/${req.params.id}`);
}))

app.get('/campground', catchAsync(async (req, res) => {
    const campground = await Campground.find();
    res.status(200).render('home', { campground, title: "Campground" });
}));
app.get('/campground/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    // console.log(camp);
    res.status(200).render('show', { camp, title: camp.title });
}))
app.get('/campground/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.status(200).render('edit', { camp, title: camp.title });
}))
app.put('/campground/:id', validateCampground,catchAsync(async (req, res) => {
    const { title, location, price, description, image } = req.body;
    const id = req.params.id;
    if (!title || !location || !price || !description || !image || !id) throw new ExpressError('Invalid Campground Data', 400);
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    res.redirect(`/campground/${camp._id}`);
}))
app.delete('/campground/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campground');
}));

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