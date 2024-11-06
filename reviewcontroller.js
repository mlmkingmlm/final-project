const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");


module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "Review Created");
    res.redirect(`/listing/${listing._id}/show`)
}

module.exports.deletereview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}/show`);
}

