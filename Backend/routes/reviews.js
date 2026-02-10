const express = require("express");
const router = express.Router({mergeParams:true});
const {listingschema , reviewschema} = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validatereview, isAuthor } = require("../middleware.js");
const { createreview, deletereview } = require("../controllers/reviews.js");


//review route
router.post("/",isLoggedIn,validatereview,wrapasync(createreview));
//Delete review route
router.delete("/:reviewid",isLoggedIn,isAuthor,wrapasync(deletereview));

module.exports=router;