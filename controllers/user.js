import listingModel from "../models/Listing.js";
import userModel from "../models/User.js";

export async function registeredUser(req, res, next) {
  // console.log(req.file, ".......", req.body);
  const { username, email, password } = req.body;
  const newUser = new userModel({ username, email, avatar: req.file.path });
  const registeredUser = await userModel.register(newUser, password);

  newUser.save();

  req.login(registeredUser, (err) => {
    // automatic login if registered
    if (err) {
      return next(err);
    }
    req.flash(
      "success",
      `${registeredUser.username} you are registered and logged in`
    );
    res.redirect("/listing");
  });
}

export function logOut(req, res, next) {
  req.logout((err) => {
    // using .deserializeUser()
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out");
    res.redirect("/listing");
  });
}

export function logIn(req, res) {
  const redirectUrl = res.locals.returnTo || "/listing";
  delete req.session.returnTo;
  req.flash("success", "Welcome back to cozyStay!");
  res.redirect(redirectUrl);
}

export function loginform(req, res) {
  res.locals.currentPage = 'login'

  res.render("users/login.ejs");
}

export function registerform(req, res) {
  res.locals.currentPage = 'register'
  res.render("users/register.ejs");
}

export async function addToWishlist(req, res) {
  let data = await userModel.findById(req.user._id);
  let { listingid } = req.params;
  if (data.wishlist.includes(listingid)) {
    const index = data.wishlist.indexOf(listingid);
    data.wishlist.splice(index, 1);
  } else {
    data.wishlist.push(listingid);
  }
  await data.save();
  res.redirect("/listing");
}

export async function userWishlist(req, res) {
  res.locals.currentPage = 'wishlist'
  let  avgrating=0;
  let data = await userModel.findById(req.user._id);
  let wishlistItem = await listingModel.find({ _id: { $in: data.wishlist } });

  res.render("listings/index.ejs", { data: wishlistItem, avgrating });
}
