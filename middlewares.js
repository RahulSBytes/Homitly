import listingModel from "./models/Listing.js";
import reviewModel from "./models/Review.js";
import ExpressError from "./utility/errorClass.js";
import { listingJoiSchema, userJoiSchema, reviewJoiSchema } from "./utility/joivalidator.js";

export function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you need to login first");
    return res.redirect("/user/login");
  }
  next();
}

export function storeReturnTo(req, res, next) {
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
}

export function asyncWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export async function isOwner(req, res, next) {
  let { id } = req.params;
  const listdata = await listingModel.findById(id);
  if (!res.locals.currUser._id.equals(listdata.host._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`${id}`);
  }
  next();
}


export async function isReviewAuthor(req, res, next) {
  let { id, reviewId } = req.params;
  const reviewData = await reviewModel.findById(reviewId);
  // console.log("--------",reviewData)
  if (!res.locals.currUser._id.equals(reviewData.author)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listing/${id}`);
  }
  next();
}


export function validateListing(req, res, next) {
  let { error } = listingJoiSchema.validate(req.body, { abortEarly: false });
  if (!error) {
    next(new ExpressError(404, error.details[0].message));
  } else {
    next();
  }
}


export function validateUser(req, res, next) {
  let { error } = userJoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // next(new ExpressError(404, error.details[0].message));
    req.flash("error", error.details[0].message);
    res.redirect("/user");
  } else {
    next();
  }
}


export function validateReview(req, res, next) {
  let { error } = reviewJoiSchema.validate(req.body, { abortEarly: false });
  if (!error) {
    throw new ExpressError(404, "error validating schema :: review");
  } else {
    next();
  }
}