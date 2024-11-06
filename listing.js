const express = require("express");
const router = express.Router()
const asyncwrap = require("../utils/wrapAsync.js");
const { listingschema} = require("../joi.js");
const expressError = require("../utils/expressError.js");
const { islogin, isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listingcontroler.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js"); 
const upload = multer({ storage})


const validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
}



// index route

router.get("/", asyncwrap(listingcontroller.index));

// add new listing
router.get("/new", islogin, listingcontroller.newlistingform);

router.post("/", upload.single("listing[image]"),validatelisting, asyncwrap(listingcontroller.addnewlisting));

// delete route

router.get("/:id/delete", islogin, isOwner, asyncwrap(listingcontroller.delete))

// edit route

router.get("/:id", islogin, asyncwrap(listingcontroller.editform))

router.put("/:id", islogin, isOwner,upload.single("listing[image]"), asyncwrap(listingcontroller.editlisting))



// show route

router.get("/:id/show", asyncwrap(listingcontroller.showlisting));


module.exports = router;
