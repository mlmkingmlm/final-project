const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {loginredirect} = require("../middleware.js");
const usercontroller = require("../controllers/usercontroller.js")

router.route("/signup").get(usercontroller.signupform)
.post( wrapAsync(usercontroller.signup));

router.route("/login").get( usercontroller.loginform)
.post( loginredirect, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
usercontroller.login
)

// logout route
router.get("/logout", usercontroller.logout)

module.exports = router;