const express = require("express");
const router = express.Router();
const ExpressError=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
// const ListingController = require("../controllers/listing.js");

// const {isLoggedIn, isOwner} = require("../middleware.js")
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js"); // ← import from middleware
const { index, newroute, newroutepost, showroute, editroute, updateroute, deleteroute } = require("../controllers/listing.js");





router.get("/", wrapasync(index));
//new route
router.get("/new",isLoggedIn,newroute);

router.post("/",isLoggedIn,validatelisting, wrapasync(newroutepost));

//specific route
router.get("/:id",wrapasync(showroute));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(editroute));
//update route
router.put("/:id",isLoggedIn,isOwner,validatelisting,wrapasync(updateroute));

//Delte route
router.delete("/:id",isLoggedIn,isOwner,wrapasync(deleteroute));


module.exports = router;