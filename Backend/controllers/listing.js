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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);
    const listing=new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};
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
    let orgimgurl = listing.image.url;
    orgimgurl=orgimgurl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,orgimgurl});
};

module.exports.updateroute=async (req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
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