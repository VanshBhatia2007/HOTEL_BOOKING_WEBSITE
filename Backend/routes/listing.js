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


router.route("/")
.get(wrapasync(index))
.post(isLoggedIn,validatelisting, wrapasync(newroutepost));

//new route
router.get("/new",isLoggedIn,newroute);

router.route("/:id")
.get(wrapasync(showroute))
.put(isLoggedIn,isOwner,validatelisting,wrapasync(updateroute))
.delete(isLoggedIn,isOwner,wrapasync(deleteroute));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(editroute));
//update route


//Delte route



module.exports = router;