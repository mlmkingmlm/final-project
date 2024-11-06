const Listing = require("./models/listing.js");
const review = require("./models/reviews.js");


const { findById } = require("./models/reviews");

module.exports.islogin=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "please first login into wonderlust");
        return res.redirect("/login");
    }
    next();
}

module.exports.loginredirect=(req, res, next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
        // console.log(res.locals.redirecturl);
    }
    next();
}

module.exports.isOwner= async(req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentuser._id)){
        req.flash("error", "you are not owner of this listing");
        return res.redirect(`/listing/${id}/show`);
    }
    next();
}

module.exports.isreviewAuthor= async(req, res, next)=>{
    let { id, reviewid} = req.params;
    let newreview = await review.findById(reviewid);
    if(!newreview.author._id.equals(res.locals.currentuser._id)){
        req.flash("error", "you are not owner of this review");
        return res.redirect(`/listing/${id}/show`);
    }
    next();
}

