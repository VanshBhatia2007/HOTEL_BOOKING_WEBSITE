const express = require("express");
const router = express.Router();
const ExpressError=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
// const {isLoggedIn, isOwner} = require("../middleware.js")
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js"); // ← import from middleware





router.get("/", wrapasync( async (req,res)=>{
    // console.log("mongoose state:", mongoose.connection.readyState);
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
})
);
//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

router.post("/",isLoggedIn,validatelisting, wrapasync( async (req,res)=>{
    const listing=new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    console.log(listing);
    req.flash("success","new listing added");
    res.redirect("/listings");
})
);

//specific route
router.get("/:id",wrapasync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","the listing you are trying to access , does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
})
);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","the listing you are trying to access , does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
})
);
//update route
router.put("/:id",isLoggedIn,isOwner,validatelisting,wrapasync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    req.flash("success","Updated successfully");
    res.redirect(`/listings/${id}`);
})
);

//Delte route
router.delete("/:id",isLoggedIn,isOwner,wrapasync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted successfully");
    res.redirect("/listings");
})
);


module.exports = router;