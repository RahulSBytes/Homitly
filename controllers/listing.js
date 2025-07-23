import listingModel from "../models/Listing.js";

export async function index(req, res) {
  const data = await listingModel.find();
  res.render("listings/index", { data });
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
  let { id } = req.params;
  const data = await listingModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  req.flash("success", "listing updated");
  res.redirect(`/listing/${id}`);
}
