const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingschema , reviewschema} = require("../schema.js");
const ExpressError=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");




const validatelisting=(req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }   
};

router.get("/", wrapasync( async (req,res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
})
);
//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

router.post("/",validatelisting, wrapasync( async (req,res)=>{
    const listing=new Listing(req.body.listing);
    await listing.save();
    console.log(listing);
    res.redirect("/listings");
})
);

//specific route
router.get("/:id",wrapasync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
})
);
//edit route
router.get("/:id/edit",wrapasync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);
//update route
router.put("/:id",validatelisting,wrapasync(async (req,res)=>{
    let result = listingschema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    res.redirect("/listings");
})
);

//Delte route
router.delete("/:id",wrapasync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
);


module.exports = router;