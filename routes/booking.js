import express from "express";
import { createBooking, renderBookingForm, renderInvoicePage, saveToDatabase } from "../controllers/booking.js";
import { asyncWrapper, isLoggedIn, validateBooking } from "../middlewares.js";
const router = express.Router({ mergeParams: true });

// Get all bookings
// router.get('/', getAllBookings);
// /listings/:listingId/book

router.get("/invoice", isLoggedIn, asyncWrapper(renderInvoicePage));

router.post("/create", isLoggedIn, asyncWrapper(saveToDatabase));

router.get("/:id", asyncWrapper(renderBookingForm));

// Get a specific booking
// router.get('/:id', getBookingById);

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
