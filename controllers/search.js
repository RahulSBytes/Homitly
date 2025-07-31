import listingModel from "../models/Listing.js";
import dataWithAvgRating from "../utils/avgRating.js";
// import expressError from "../utility/errorClass.js";

export async function searchcontroller(req, res) {
  res.locals.isHome = true;

  try {
    const query = req.query.q?.trim();
    if (!query) {
      req.flash("error", "Please enter some text");
     return res.redirect("/listing");
    }

    // For description, only match words that start with #
    const hashTagRegex = new RegExp(`#${query}\\w*`, "i");
    const textRegex = new RegExp(query, "i");

    const listings = await listingModel.find({
      $or: [
        { title: { $regex: textRegex } },
        { description: { $regex: hashTagRegex } },
        { propertyType: { $regex: textRegex } },
        { roomType: { $regex: textRegex } },
        { address: { $regex: textRegex } },
        { amenities: { $in: [query] } },
      ],
    }).populate("comments");

    res.render("listings/index.ejs", {
      data: dataWithAvgRating(listings),
      query: query,
      message: listings.length ? null : "No listings found.",
    });
  } catch (err) {
    next(err);
  }
}
