const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;