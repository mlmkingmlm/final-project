const express = require("express");
const router = express.Router({ mergeParams: true })
const asyncwrap = require("../utils/wrapAsync.js");
const { reviewschema } = require("../joi.js");
const { islogin, isreviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviewcontroller.js")

// review validate
const validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
}

// review route 
router.post("/", islogin, validatereview, asyncwrap(reviewcontroller.createreview))

// delete review
router.delete("/:reviewid", islogin, isreviewAuthor, asyncwrap(reviewcontroller.deletereview))

module.exports = router;