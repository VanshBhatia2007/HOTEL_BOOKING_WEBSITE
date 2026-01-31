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
const listings = require("./routes/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/hotel_booking";
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionoptions ={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.get("/",(req,res)=>{
    res.send("hiiiiii");
});

app.use(session(sessionoptions));
app.use(flash());

main()
    .then(()=>{
    console.log("connected to db");
})
    .catch((err)=>{
        console.log(err);
    });




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
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    console.log(res.locals.success)
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.all(/(.*)/,(req,res,next)=>{
    if (req.path === "/.well-known/appspecific/com.chrome.devtools.json") {
        return res.status(204).end();
    }
    if (req.path === "/favicon.ico") return res.status(204).end();
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    console.error(err);
    let { statusCode: statuscode = 500, message = "something went wrong" } = err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
});
app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});