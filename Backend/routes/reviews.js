const express = require("express");
const router = express.Router({mergeParams:true});
const {listingschema , reviewschema} = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validatereview } = require("../middleware.js");


//review route
router.post("/",isLoggedIn,validatereview,wrapasync(async(req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","new Review added");
    res.redirect(`/listings/${listing.id}`);
})
);
//Delete review route
router.delete("/:reviewid",isLoggedIn,wrapasync(async(req,res)=>{
    let {id , reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
})
);

module.exports=router;