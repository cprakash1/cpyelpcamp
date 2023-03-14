const express=require('express')
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../model/campground.js');
const {campgroundSchema} = require('../schema');
const expressError = require('../utils/expressError');


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



router.get('/', catchAsync(async (req, res) => {
    const campground = await Campground.find();
    res.status(200).render('home', { campground, title: "Campground" });
}));
router.post('/', validateCampground,catchAsync(async (req, res, next) => {
    const { title, location, price, description, image } = req.body;
    const camp = await new Campground({ title, location, price, description, image });
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}))
router.get('/new', (req, res) => {
    res.status(200).render('new', { title: "New Campground" });
})
router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    // console.log(camp);
    res.status(200).render('show', { camp, title: camp.title });
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.status(200).render('edit', { camp, title: camp.title });
}))
router.put('/:id', validateCampground,catchAsync(async (req, res) => {
    const { title, location, price, description, image } = req.body;
    const id = req.params.id;
    if (!title || !location || !price || !description || !image || !id) throw new ExpressError('Invalid Campground Data', 400);
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    res.redirect(`/campground/${camp._id}`);
}))
router.delete('/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campground');
}));

module.exports=router;