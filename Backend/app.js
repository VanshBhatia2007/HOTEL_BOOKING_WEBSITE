const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const Listing = require("./models/listing.js");

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

app.get("/listings",async (req,res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",async (req,res)=>{
    const listing=new Listing(req.body.listing);
    await listing.save();
    console.log(listing);
    res.redirect("/listings");
});
//specific route
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});


app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});