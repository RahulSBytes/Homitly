import listingModel from "../models/Listing.js";

export async function index(req, res) {
  // console.log(res.locals.currUser ? res.locals.currUser : "its null");

  const data = await listingModel.find().populate("comments");
  res.locals.isHome = true;
  // calculaating average rating
  let avgrating = 0;
  let sum = 0;
  /*
  if (!(data[0].comments && data[0].comments.length === 0)) {
    for (let i = 0; i < data[0].comments.length; i++) {
      sum = data[0].comments[i].rating + sum;
    }
    avgrating = sum / data[0].comments.length;
  }
 */
  // console.log(data[0].comments[0].rating);
  res.render("listings/index", { data, avgrating });
}

export async function createListingGet(req, res) {
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

  // console.log(data.comments[0].author.avatar)
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
