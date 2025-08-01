import mongoose from "mongoose";
import reviewModel from "./Review.js";

export const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ["Apartment", "House", "Villa", "Cabin", "Other"],
  },
  roomType: {
    type: String,
    required: true,
    enum: ["Entire place", "Private room", "Shared room"],
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  beds: {
    type: Number,
    required: true,
    min: 0,
  },
  bathroom: {
    type: Number,
    required: true,
    min: 0,
  },
  amenities: {
    type: [String],
    default: [],
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  cleaningFee: {
    type: Number,
    default: 0,
  },
  photos: {
    path:{
      type: String,
      required:true
    },
    filename: String,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId,
     ref: "reviewModel" }],
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc.comments.length) {
    let result = await reviewModel.deleteMany({ _id: { $in: doc.comments } });
  }
});


const listingModel = mongoose.model("listing", listingSchema);

export default listingModel;
