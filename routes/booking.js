import express from "express";
import { createBooking, getAllBookings, renderBookingForm, saveToDatabase } from "../controllers/booking.js";
import { asyncWrapper, isLoggedIn, validateBooking } from "../middlewares.js";
const router = express.Router({ mergeParams: true });

// Get all bookings
router.get('/', asyncWrapper(getAllBookings));
// /listings/:listingId/book

// router.get("/invoice", isLoggedIn, asyncWrapper(renderFinalPage));

router.post("/create", isLoggedIn, asyncWrapper(saveToDatabase));


// Get a specific booking
// router.get('/:id', getBookingById);


router.get("/:id", asyncWrapper(renderBookingForm));

// Create a new booking
router.post(
  "/:listingid",
  isLoggedIn,
  validateBooking,
  asyncWrapper(createBooking)
);

// Cancel (delete) a booking
// router.delete('/bookings/:id', cancelBooking);

export default router;


// [post]/:listingid [store in session] & finally render middle page  --> on middle page : go through details when clicked to button push the data into the db & finally render final page.