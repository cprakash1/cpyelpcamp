const express=require('express')
const router=express.Router();
const User=require('../model/user')
const wrapAsync=require('../utils/catchAsync');
const passport=require('passport')

router.get('/register',(req,res)=>{
    res.render('./user/register.ejs',{title:'Register'});
})
router.post('/register',wrapAsync(async(req,res)=>{
    try{
        const {username,password,email}=req.body;
        const user=new User({username,email});
        const newuser=await User.register(user,password);
        req.flash('success','Welcome to YelpCamp.You are Successfully Registered and Logging you In!')
        req.login(newuser,err=>{
            if(err){
                return next(err);
            }
            res.redirect('/campground');
        })
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    // console.log(newuser)
}))

router.get('/login',(req,res)=>{
    res.render('./user/login',{title:'Login'})
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),(req,res)=>{
    req.flash('success','Welcome Back!!')
    // console.log(req.session)
    const redirecturl=req.session.returnTo || '/campground'
    delete req.session.returnTo;
    res.redirect(redirecturl)
})
router.get('/logout',wrapAsync(async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Logged You Out')
        return res.redirect('/campground')
    });
}))
module.exports=router;