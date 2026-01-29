const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
engine = require('ejs-mate');
app.engine('ejs', engine);
var methodOverride = require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const wrapasync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/expresserror.js");
const Joi = require('joi');
const Listing = require("./models/listing.js");
const {listingschema , reviewschema} = require("./schema.js");
const Review = require("./models/review.js");
const console = require("console");

const MONGO_URL = "mongodb://127.0.0.1:27017/hotel_booking";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
    console.log("connected to db");
})
    .catch((err)=>{
        console.log(err);
    });


app.get("/",(req,res)=>{
    res.send("hiiiiii");
});

const validatelisting=(req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw ExpressError(400,errmsg);
    }else{
        next(error);
    }   
};

const validatereview=(req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next(error);
    }   
};

app.get("/listings", wrapasync( async (req,res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
})
);
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",validatelisting, wrapasync( async (req,res)=>{
    const listing=new Listing(req.body.listing);
    await listing.save();
    console.log(listing);
    res.redirect("/listings");
})
);

//specific route
app.get("/listings/:id",wrapasync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
})
);
//edit route
app.get("/listings/:id/edit",wrapasync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);
//update route
app.put("/listings/:id",validatelisting,wrapasync(async (req,res)=>{
    let result = listingschema.validate(req.body);
    console.log(result);
    if(result.err){
        throw ExpressError(400,result.error);
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    res.redirect("/listings");
})
);
//review route
app.post("/listings/:id/reviews",validatereview,wrapasync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
})
);
//Delte route
app.delete("/listings/:id",wrapasync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
);

app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(505,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statuscode=500,message="something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
});
app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});