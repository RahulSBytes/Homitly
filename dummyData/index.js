import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

import dummyListings from './data.js'
import listingModel from '../models/Listing.js'
import connectDB from "../db/index.js";


connectDB();

await listingModel.insertMany(dummyListings)
