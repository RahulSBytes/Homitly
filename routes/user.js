import express from "express";
const router = express.Router({ mergeParams: true });
import userModel from "../models/User.js";
import passport from "passport";
import { storeReturnTo, asyncWrapper, validateUser } from "../middlewares.js";



router.get("/", (req, res) => {
  res.render("users/register.ejs");
});


router.post(
  "/",
  validateUser,
  asyncWrapper(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new userModel({ username, email });
    const registeredUser = await userModel.register(newUser, password);

    req.login(registeredUser, (err) => {  // automatic login if registered
      if (err) {
        return next(err);
      }
      req.flash("success", `${registeredUser.username} you are registered and logged in`);
      res.redirect("/listing");
    });
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    // using .deserializeUser()
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out");
    res.redirect("/listing");
  });
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});



router.post(
  "/login",
  storeReturnTo, // <-- THIS captures path before passport wipes it!
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true
  }),
  (req, res) => {
    const redirectUrl = res.locals.returnTo || "/listing";
    delete req.session.returnTo; // cleanup
    req.flash("success", "Welcome back to cozyStay!");
    res.redirect(redirectUrl);
  }
);


export default router;
