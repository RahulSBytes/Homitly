import listingModel from "../models/Listing.js";
import reviewModel from "../models/Review.js";

export async function deleteReview(req, res){
    let { id, reviewId } = req.params;
    await listingModel.findByIdAndUpdate(id, {
      $pull: { comments: reviewId },
    });
    await reviewModel.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "review deleted");

    res.redirect(`/listing/${id}`);
  }

  export async function reviewPost(req, res){
    let listData = await listingModel.findById(req.params.id);
    let reviewData = await reviewModel.create({ ...req.body, author: req.user._id, });
    listData.comments.push(reviewData._id);
    // coz we altered the listing document we gotta save it explicitly
    await listData.save();
    req.flash("success", "review posted");
    res.redirect(`/listing/${req.params.id}`);
  }