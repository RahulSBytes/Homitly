// import { number} from "joi";
import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  checkin: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^\+\d{1,3}\d{6,14}$/,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  listingid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listingModel",
    required: true
  },
  bookedOn: {
    type: Date,
    default: Date.now,
  },
});

const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;
