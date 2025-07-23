import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB);
    console.log("connection established");
    return connection;
  } catch (error) {
    console.log("error occoured :: ", error);
    process.exit(1);
  }
}
