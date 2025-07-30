import express from "express";
const router = express.Router({ mergeParams: true });

import passport from "passport";
import {
  storeReturnTo,
  asyncWrapper,
  validateUser,
  isLoggedIn,
} from "../middlewares.js";

import { storage } from "../cloudConfig.js";
import multer from "multer";
import {
  addToWishlist,
  logIn,
  loginform,
  logOut,
  registeredUser,
  registerform,
  userWishlist,
} from "../controllers/user.js";
const upload = multer({ storage });

router.get("/", registerform);

router.get("/wishlist", asyncWrapper(userWishlist));

router.post(
  "/",
  upload.single("avatar"),
  validateUser,
  asyncWrapper(registeredUser)
);

router.post("/wishlist/:listingid", isLoggedIn, asyncWrapper(addToWishlist));

router.get("/logout", asyncWrapper(logOut));

router.get("/login", loginform);

router.post(
  "/login",
  storeReturnTo, // <-- THIS captures path before passport wipes
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  logIn
);

export default router;
