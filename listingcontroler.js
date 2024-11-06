const Listing = require("../models/listing.js");

module.exports.index= async (req, res) => {
    const alllistings = await Listing.find();
    res.render("index.ejs", { alllistings });
}

module.exports.newlistingform = (req, res) => {
    res.render("new.ejs");
}

module.exports.addnewlisting= async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    // res.redirect("/listing");
    req.flash("success", "New listing created");
    res.redirect("/listing");
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let delet = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
}

module.exports.editform= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
}

module.exports.editlisting= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};   
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}/show`);
}

module.exports.showlisting=async (req, res) => {
    let { id } = req.params;
    const chat = await Listing.findById(id).populate({path: "reviews", populate:{path:"author"}}).populate("owner");
    if(!chat){
        req.flash("error", "Listing not found which you requested");
        res.redirect("/listing");
    } else{
        res.render("show.ejs", { chat });
    }
}