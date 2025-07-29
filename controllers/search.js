import listingModel from "../models/Listing.js";

export async function searchcontroller(req, res) {
      res.locals.isHome = true;

  try {
    const query = req.query.q?.trim();
    if (!query) {
      return res.send({
        results: [],
        query: "",
        message: "No search query provided.",
      });
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
        { amenities: { $in: [query] } }, // amenities is an array of strings
      ],
    });

    // console.log(listings)

    res.render("listings/index.ejs", {
      data: listings,
      avgrating: 0,
      query: query,
      message: listings.length ? null : "No listings found.",
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send({
      results: [],
      query: req.query.q,
      message: "Something went wrong. Please try again later.",
    });
  }
}
