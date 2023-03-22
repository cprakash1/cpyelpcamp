const express=require('express')
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../model/campground.js');
const {campgroundSchema} = require('../schema');
const expressError = require('../utils/expressError');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');
const campgroundC=require('../controller/campground')


router.route('/')
    .get(catchAsync(campgroundC.renderIndexPage))
    .post(isLoggedIn ,validateCampground,catchAsync(campgroundC.createCampground));
    

router.get('/new',isLoggedIn ,campgroundC.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundC.renderIndivisualShowPage))
    .put(isLoggedIn, catchAsync(isAuthor) ,validateCampground,catchAsync(campgroundC.submitEditedIndivisualCampground))
    .delete( isLoggedIn, catchAsync(isAuthor),catchAsync(campgroundC.deleteIndivisualCampground));

router.get('/:id/edit',isLoggedIn, catchAsync(isAuthor),catchAsync(campgroundC.renderEditIndivisualCampground))



module.exports=router;