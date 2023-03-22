module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl)
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be Logged In');
        res.redirect('/login')
    }else{
        next();
    }
}