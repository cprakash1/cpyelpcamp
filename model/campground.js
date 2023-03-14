const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

});

//middleware for deleting a campground   => 2 types Pre,post
campgroundSchema.post('findOneAndDelete',async function (doc){
    // console.log(doc);
    if(doc){
        
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',campgroundSchema);