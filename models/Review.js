import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim:true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:"User",
  }
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);

export default reviewModel;