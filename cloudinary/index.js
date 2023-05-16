const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
//     cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
    cloud_name:"dhtxywza0",
    api_key:"354165675562221",
    api_secret:"eoQvRXqFYc6bZAHsEH0uLPijVVo"
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpg','png','jpeg']
    }
});

module.exports={
    storage,
    cloudinary
};