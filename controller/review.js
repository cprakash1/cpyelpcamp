const Campground=require('../model/campground')
const Review=require('../model/review')

module.exports.createReview=async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author=req.user._id; 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success','successfully Created Campground')
    res.redirect(`/campground/${req.params.id}`);
};

module.exports.deleteReview=async(req,res)=>{
    // res.send("You have deleted!!!!")

    //it has its own log check middleware

    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully Deleted Review')
    res.redirect(`/campground/${id}`)
}