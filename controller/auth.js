const User=require('../model/user')

module.exports.renderRegisterForm=(req,res)=>{
    res.render('./user/register.ejs',{title:'Register'});
}

module.exports.submitRegisterForm=async(req,res)=>{
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
};

module.exports.renderLogInForm=(req,res)=>{
    res.render('./user/login',{title:'Login'})
}

module.exports.LogIn=(req,res)=>{
    req.flash('success','Welcome Back!!')
    // console.log(req.session)
    const redirecturl=req.session.returnTo || '/campground'
    delete req.session.returnTo;
    res.redirect(redirecturl)
}

module.exports.LogOut=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Logged You Out')
        return res.redirect('/campground')
    });
}

