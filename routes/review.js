const express=require('express')
const router=express.Router({mergeParams:true})
const Review=require('../model/review')
const Campground = require('../model/campground.js');
const {reviewSchema} = require('../schema');
const expressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');


const validatereview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(message,404)
    }else {
        next();
    }
}

router.post('/',validatereview,catchAsync(async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campground/${req.params.id}`);
}))
router.delete('/:reviewId',catchAsync(async(req,res)=>{
    // res.send("You have deleted!!!!")
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`)
}))

module.exports=router