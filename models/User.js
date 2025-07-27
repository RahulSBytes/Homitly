// import { ref } from "joi";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import bookingModel from "./Booking.js";

const userSchema = mongoose.Schema({
  avatar: {
    type: String,
    default:
      "https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg",
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listingModel",
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
  ],
});

/*
Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value itself.

here is how stored data looks:
{
  gmail: 'rahul@gmail.com',
  _id: new ObjectId('687da67fac2a5a4b2baeea3a'),      
  username: 'rajiv',
  salt: '492d4eccb2e7a4f3fff69e6ede579b125e43f64c70fc427abc3a73c84d7b72f2',
  hash: '320dcad2851453a53065e00b19b9023d2ce9b3261f0ce2fbb49f27fc88620004b4504d0462f626a13c92483b9d8fd2d4eef9a939db3def053e656f613d67a37d414dce9b8e30c52485fd63eaa8c971b1c2f68d5a6530feedf738ac1d3614bd8a726882c0c77e803b9f9cbeafe536754f3d5a50ab9639a725d2ba7c9c10575905b593710c71ba6a818d7c33367ad4b52dee50ad435c0a500d5a24aaeb5f48ce12aecfda4607d0eea72ffc626e94e8ed1701a91acc0d5473a861f790ea21aa63d1d39f4092f67e44df5f769f527309f4e95142912ee3f6a4083c29f6244456f4c5ae49237f667a212eeefd43f6eabf137d2a0c8070f50f6d37df0d371c12d2009a444aa3dd565b605ed14d619124c789c2ff2b7b47845047d4ebcfc72455467df16300da264dbdad18aecbbfec01b562262ff71e40e304c9963035ac4ca430cb518e1e1554bd9dbcd73fbae5c786e32faef58e918fbc4e17ac028d535a8216601a2570c55cca2d4398e325e2b3f319cca98563f567b48ec18cae2135db04583b26e28b89291f3896470bb17e80401788aa92557f1048c381799b83839607615a1766a278002d2b20da853cfaa47f87924ce10f60f8acbb9cd3aeef8feb1beeaac42912f9b6566797d499d08d5a18c8bc76f9a8451fed67de083e8a6ea1e3f4e42b13ea076902644469ba3489003acfd756290d83dcef93f1b6af0502a43219eccd',
  __v: 0
}
*/

userSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("User", userSchema);
export default userModel;
