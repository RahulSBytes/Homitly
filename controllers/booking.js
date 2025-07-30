import bookingModel from "../models/Booking.js";
import listingModel from "../models/Listing.js";
import userModel from "../models/User.js";
import expressError from "../utility/errorClass.js";
import { emailSender } from "../utils/email.js";

// import puppeteer from 'puppeteer';
// import nodemailer from 'nodemailer';

export function renderBookingForm(req, res) {
  res.render("bookings/booking.ejs", { listingId: req.params.id });
}

// creating and storing to the session
export async function createBooking(req, res) {
  let numberofdays =
    (new Date(req.body.checkout) - new Date(req.body.checkin)) /
    (1000 * 60 * 60 * 24);

  // Parallel database queries for better performance
  const [userdata, listingdata] = await Promise.all([
    userModel.findById(req.user._id),
    listingModel.findById(req.params.listingid).populate("host"),
  ]);

  let { pricePerNight = 0, cleaningFee = 0 } = listingdata;

  let payableAmount = Math.floor(
    pricePerNight * numberofdays + cleaningFee + 300
  );

  let tax = Math.floor((12 / 100) * payableAmount);

  let sessionObj = {
    ...req.body,
    numberofdays,
    payableAmount,
    userid: req.user._id,
    listingid: req.params.listingid,
  };

  req.session.bookingData = sessionObj;

  let invoicedata = { ...userdata, ...listingdata, ...sessionObj };

  req.session.invoicedata = { ...invoicedata, tax };
  req.flash("success", "Property booked successfully");
  res.render("bookings/middle.ejs", {
    data: invoicedata,
    tax,
  });

  // -------------------------
}

export async function saveToDatabase(req, res, next) {
  try {
    let data = await bookingModel.create(req.session.bookingData);
    // let populatedData = await data.populate('userid').populate('listingid');
    let populatedData = await bookingModel.populate(data, [
      { path: "userid" },
      {
        path: "listingid",
        populate: { path: "host" },
      },
    ]);

    let time = {
      checkin: data.checkin.toISOString().substring(0, 10),
      checkout: data.checkout.toISOString().substring(0, 10),
    };

    let user = await userModel.findById(data.userid);
    user.bookings.push(data._id);
    await user.save();

    // ------------------------

    try {
      await emailSender(req.session.invoicedata, req.user);
      console.log("Confirmation email sent for booking");
    } catch (err) {
      return next(new Error("Failed to send email: " + err.message));
    }

    //------------------------------------

    delete req.session.bookingData;

    res.render("bookings/final.ejs", { data, time });
  } catch (error) {
    return next(new expressError(500, `something broke server-side`));
  }
}

export async function getAllBookings(req, res, next) {
  try {
    res.locals.currentPage = "bookings";
    let bookingsData = await bookingModel
      .find({ userid: req.user._id })
      .populate("listingid");

    const bookingsWithStatus = bookingsData.map((booking) => {
      const now = new Date();
      const checkin = new Date(booking.checkin);
      const checkout = new Date(booking.checkout);

      let status = "upcoming";
      if (checkout < now) status = "completed";
      else if (checkin <= now && checkout >= now) status = "ongoing";

      return {
        // adding status and status-class to each object
        ...booking.toObject(),
        status,
        checkin: booking.checkin.toISOString().substring(0, 10),
        checkout: booking.checkout.toISOString().substring(0, 10),
        bookedOn: booking.bookedOn.toISOString().substring(0, 10),
        payableAmount: (12 / 100) * booking.payableAmount,
        statusClass: `status-${status}`,
      };
    });

    res.render("bookings/bookedlist.ejs", { bookings: bookingsWithStatus });
  } catch (error) {
    // console.log(error);
    next(error);
  }
}
