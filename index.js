import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});


import express from "express";
import connectDB from "./db/index.js";
import path from "path";
import methodOverride from "method-override";
import ExpressError from "./utility/errorClass.js";
import listing from "./routes/listings.js";
import review from "./routes/reviews.js";
import user from "./routes/user.js";
import search from "./routes/search.js";
import booking from "./routes/booking.js";
import session from "express-session";
import flash from "connect-flash";
import expressLayouts from "express-ejs-layouts";
import userModel from "./models/User.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
const app = express();

// ------------------ path setting-----------

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "partials/boilerplate");
app.use(methodOverride("_method"));
app.use(flash());

let store = MongoStore.create({
  mongoUrl: process.env.MONGO_DB_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 7 * 24 * 60 * 60 * 1000,
});

store.on("error", () => {
  console.log("error occured in setting up the session");
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3, //ms  [prefered]
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());
// note : flash & passport also uses session

//database connection

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`the app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("error occured on listening :: ", err);
  });

//routes

app.get("/", (req, res) => {
  // no need to use async or to wrap with asyncWrapper coz no async task is being done here.
  res.redirect("/listing");
});

app.use((req, res, next) => {
  // contains the variables that you want to be available to all the request/views/routes
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isHome = false; // to check if the user is on homepage || this will be overrite in home/index route.
  res.locals.currUser = req.user; //now current user's info will be available every request 'req.user' is given by passportjs when user logs in
  res.locals.currentPage = "";
  next();
});

app.use("/listing", listing);
app.use("/search", search);
app.use("/listing/:id/review", review);
app.use("/user", user);
app.use("/bookings", booking);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//----------global error handler--------------

app.use((err, req, res, next) => {
  let { status = 500, message = "something broke" } = err;
  res.status(status).send(message);
});
