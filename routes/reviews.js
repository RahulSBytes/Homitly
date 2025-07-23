import express from "express";
const router = express.Router({ mergeParams: true });
import {
  isLoggedIn,
  asyncWrapper,
  validateReview,
  isReviewAuthor,
} from "../middlewares.js";
import { deleteReview, reviewPost } from "../controllers/review.js";

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrapper(deleteReview)
);

router.post("/", isLoggedIn, validateReview, asyncWrapper(reviewPost)); 

export default router;
