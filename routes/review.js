const express=require('express')
const router=express.Router({mergeParams:true})
const Review=require('../model/review')
const Campground = require('../model/campground.js');
const catchAsync = require('../utils/catchAsync');
const {validatereview,isLoggedIn,isreviewowner,isReviewLoggedIn}=require('../middleware')



router.post('/',isReviewLoggedIn,validatereview,catchAsync(async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author=req.user._id; 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success','successfully Created Campground')
    res.redirect(`/campground/${req.params.id}`);
}))
router.delete('/:reviewId',isReviewLoggedIn,isreviewowner,catchAsync(async(req,res)=>{
    // res.send("You have deleted!!!!")

    //it has its own log check middleware

    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully Deleted Review')
    res.redirect(`/campground/${id}`)
}))

module.exports=router