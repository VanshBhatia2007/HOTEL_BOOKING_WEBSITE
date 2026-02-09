// const Listing = require("./models/listing");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingschema , reviewschema} = require("./schema.js");
const ExpressError=require("./utils/expresserror.js");
module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.method === "GET" 
            ? req.originalUrl 
            : req.headers.referer || "/listings";
        req.flash("error","you must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You do not have the permission to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }   
};

module.exports.validatereview=(req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }   
};

module.exports.isAuthor=async(req,res,next)=>{
    let { id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You dont have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}