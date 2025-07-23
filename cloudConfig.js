import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// console.log("-----", process.env.API_SECRET)

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cozystay",
    allowedFormat: ["png", "jpg", "jpeg"],
  },
});

export { cloudinary, storage };
