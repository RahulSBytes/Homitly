import listingModel from "../models/Listing.js";
import dataWithAvgRating from "../utils/avgRating.js";

export async function index(req, res) {
  res.locals.currentPage = "listings";
  res.locals.isHome = true;
  const data = await listingModel.find().populate("comments");
  res.render("listings/index.ejs", { data: dataWithAvgRating(data) });
}


export async function createListingGet(req, res) {
  res.locals.currentPage = "newlisting";

  // no need to use async or to wrap with asyncWrapper coz no async task is being done here.
  res.render("listings/new");
}

export async function createListingPost(req, res) {
  let { path, filename } = req.file;
  await listingModel.create({
    ...req.body,
    host: req.user._id,
    photos: { path, filename },
  });

  req.flash("success", "new listing created");
  res.redirect("/listing");
}



export async function showListing(req, res) {
  // throw new expressError("middleware")
  const data = await listingModel
    .findById(req.params.id)
    .populate({
      // nested populate
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("host"); // chainning posible


  if (!data) {
    req.flash("error", "accessed listing is not available");
    res.redirect("/listing");
  }


  // res.locals.loc =[data.location.lat, data.location.lng]


  res.render("listings/show", { data });
}



export async function deleteListing(req, res) {
  await listingModel.findOneAndDelete({ _id: req.params.id });
  req.flash("success", "listing deleted");
  res.redirect("/listing");
}

export async function editListing(req, res) {
  const data = await listingModel.findById(req.params.id);
  res.render("listings/edit", { data });
}

export async function updateListing(req, res) {
  try {
    let { id } = req.params;
    const { photos } = await listingModel.findById(id);

    const data = await listingModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (typeof req.file === "undefined") {
      data.photos = photos;
    } else {
      let { path = photos.path, filename = photos.filename } = req.file;
      data.photos = { path, filename };
    }

    await data.save();
    req.flash("success", "listing updated");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    next(error);
  }
}
