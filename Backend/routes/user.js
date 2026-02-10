const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const { signuppage, signup, loginpage, login, logout } = require("../controllers/user.js");

router.get("/signup",signuppage);

router.post("/signup", wrapasync(signup));
//login
router.get("/login",loginpage);

router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect : "/login", failureFlash: true,}),login);

//logout
router.get("/logout",logout);

module.exports = router;