const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js"); 

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/hotel_booking");
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69f63ca5250950596f6f3069" }));
    await Listing.insertMany(initData.data);
    console.log("Data seeded successfully!");
    mongoose.connection.close();
}

main();