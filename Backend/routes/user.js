const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    
    res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(async(req,res)=>{
    // console.log("BODY:", req.body);
    try{
        let {username,email,password}= req.body;
        const newuser = new User({email,username});
        const registereduser = await User.register(newuser,password);
        console.log(registereduser);
        req.flash("success","Welcome to Airbnb");
        res.redirect("/listings");  
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
})
);
//login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",passport.authenticate("local",{failureRedirect : "/login", failureFlash: true,}),async(req,res)=>{
    req.flash("success","you are logged in");
    res.redirect("/listings");
})

//logout
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
});

module.exports = router;