import bookingModel from "../models/Booking.js";
import userModel from "../models/User.js";

export function createBooking(req, res) {
  req.session.bookingData = {
    ...req.body,
    userid: req.user._id,
    listingid: req.params.listingid,
  };

  res.redirect("/bookings/invoice");
}



export async function saveToDatabase(req, res) {
  let data = await bookingModel.create(req.session.bookingData);

  let user = await userModel.findById(req.user._id);
  user.bookings.push(data._id);
  await user.save();

  delete req.session.bookingData;

  req.flash("success", "property booked");
  res.send("see database");
}


export function renderBookingForm(req, res){
  res.render("bookings/booking.ejs", { listingId: req.params.id });
}

export function renderInvoicePage(req, res){
  // invoice page
  res.render("bookings/bookingInvoice.ejs", { data: req.session.bookingData });
}