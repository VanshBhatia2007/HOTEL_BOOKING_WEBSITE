const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { data: sampleListings } = require("./data.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/hotel_booking"); // apna DB name likho
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("Data seeded successfully!");
    mongoose.connection.close();
}

main().catch(console.error);