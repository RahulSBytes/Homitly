import express from "express";
const router = express.Router({ mergeParams: true });
import {
  isLoggedIn,
  asyncWrapper,
  isOwner,
  validateListing,
} from "../middlewares.js";
import {
  createListingGet,
  createListingPost,
  deleteListing,
  editListing,
  index,
  showListing,
  updateListing,
} from "../controllers/listing.js";
import { cloudinary, storage } from "../cloudConfig.js";
import multer  from 'multer'
const upload = multer({ storage })



router.post("/", isLoggedIn, upload.single('photos'),validateListing, asyncWrapper(createListingPost));

router.get("/", asyncWrapper(index));

router.get("/new", isLoggedIn, createListingGet);

router.get("/:id", asyncWrapper(showListing));

router.delete("/:id", isLoggedIn, isOwner, asyncWrapper(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrapper(editListing));

router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrapper(updateListing)
);

export default router;
