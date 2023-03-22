const Campground=require('../model/campground')

module.exports.renderIndexPage=async (req, res) => {
    console.log(req.url)
    const campground = await Campground.find();
    res.status(200).render('home', { campground, title: "Campground" });
}

module.exports.createCampground=async (req, res, next) => {
    const { title, location, price, description, image } = req.body;
    const camp = await new Campground({ title, location, price, description, image });
    camp.author=req.user._id;
    await camp.save();
    req.flash('success','Successfully creating campground!')
    res.redirect(`/campground/${camp._id}`);
}

module.exports.renderNewForm=(req, res) => {
    res.status(200).render('new', { title: "New Campground" });
}

module.exports.renderIndivisualShowPage=async (req, res) => {
    //multilevel population
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error','cannot find the campground')
        return res.redirect('/campground')
    }
    res.status(200).render('show', { camp, title: camp.title });
}

module.exports.renderEditIndivisualCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if(!camp){
        req.flash('error','cannot find the campground')
        return res.redirect('/campground')
    }
    res.status(200).render('edit', { camp, title: camp.title });
}

module.exports.submitEditedIndivisualCampground=  async (req, res) => {
    const { title, location, price, description, image} = req.body;
    const id = req.params.id;
    if (!title || !location || !price || !description || !image || !id) throw new ExpressError('Invalid Campground Data', 400);
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    req.flash('success','successfully Updated Campground!')
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteIndivisualCampground=async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','successfully Deleted Campground!')
    res.redirect('/campground');
}