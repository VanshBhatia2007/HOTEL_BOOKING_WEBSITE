const Listing = require("../models/listing");



module.exports.index=async (req,res)=>{
    // console.log("mongoose state:", mongoose.connection.readyState);
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
};

module.exports.newroute =(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.newroutepost = async (req,res)=>{
    const listing=new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    console.log(listing);
    req.flash("success","new listing added");
    res.redirect("/listings");
};

module.exports.showroute =async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","the listing you are trying to access , does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.editroute =async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","the listing you are trying to access , does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateroute=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    req.flash("success","Updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteroute=async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted successfully");
    res.redirect("/listings");
}