const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/hotel_booking"

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


app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});