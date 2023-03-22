const express=require('express')
const router=express.Router({mergeParams:true})
const Review=require('../model/review')
const Campground = require('../model/campground.js');
const catchAsync = require('../utils/catchAsync');
const {validatereview,isLoggedIn,isreviewowner,isReviewLoggedIn}=require('../middleware')
const reviewC=require('../controller/review')


router.post('/',isReviewLoggedIn,validatereview,catchAsync(reviewC.createReview))

router.delete('/:reviewId',isReviewLoggedIn,isreviewowner,catchAsync(reviewC.deleteReview))

module.exports=router