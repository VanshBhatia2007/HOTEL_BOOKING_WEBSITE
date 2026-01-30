const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        filename: { type: String },
        url: { type: String },
    },
    price :  {
        type : Number,
        required : true,
        default: 0,
    },
    location : {
        type : String,
        required : true,
    },
    country :  {
        type : String,
        required : true,
    },
    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;