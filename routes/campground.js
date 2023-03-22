const express=require('express')
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../model/campground.js');
const {campgroundSchema} = require('../schema');
const expressError = require('../utils/expressError');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');







router.get('/', catchAsync(async (req, res) => {
    console.log(req.url)
    const campground = await Campground.find();
    res.status(200).render('home', { campground, title: "Campground" });
}));
router.post('/',isLoggedIn ,validateCampground,catchAsync(async (req, res, next) => {
    const { title, location, price, description, image } = req.body;
    const camp = await new Campground({ title, location, price, description, image });
    camp.author=req.user._id;
    await camp.save();
    req.flash('success','Successfully creating campground!')
    res.redirect(`/campground/${camp._id}`);
}))
router.get('/new',isLoggedIn ,(req, res) => {
    res.status(200).render('new', { title: "New Campground" });
})
router.get('/:id', catchAsync(async (req, res) => {
    //multilevel population
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error','cannot find the campground')
        return res.redirect('/campground')
    }
    res.status(200).render('show', { camp, title: camp.title });
}))
router.get('/:id/edit',isLoggedIn, catchAsync(isAuthor),catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if(!camp){
        req.flash('error','cannot find the campground')
        return res.redirect('/campground')
    }
    res.status(200).render('edit', { camp, title: camp.title });
}))
router.put('/:id',isLoggedIn, catchAsync(isAuthor) ,validateCampground,catchAsync(async (req, res) => {
    const { title, location, price, description, image} = req.body;
    const id = req.params.id;
    if (!title || !location || !price || !description || !image || !id) throw new ExpressError('Invalid Campground Data', 400);
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    req.flash('success','successfully Updated Campground!')
    res.redirect(`/campground/${camp._id}`);
}))
router.delete('/:id', isLoggedIn, catchAsync(isAuthor),catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','successfully Deleted Campground!')
    res.redirect('/campground');
}));

module.exports=router;