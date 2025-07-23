import Joi from "joi";

export const listingJoiSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),

  propertyType: Joi.string()
    .valid("Apartment", "House", "Villa", "Cabin", "Other")
    .required(),

  roomType: Joi.string()
    .valid("Entire place", "Private room", "Shared room")
    .required(),

  maxGuests: Joi.number().min(1).required(),
  bedrooms: Joi.number().min(0).required(),
  beds: Joi.number().min(0).required(),
  bathroom: Joi.number().min(0).required(),

  amenities: Joi.array().items(Joi.string()).default([]),

  address: Joi.string().required(),

  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),

  pricePerNight: Joi.number().min(0).required(),
  cleaningFee: Joi.number().min(0).default(0),

  photos: Joi.array().items(Joi.string().uri()).default([]),
});

// -------------- review schema

export const reviewJoiSchema = Joi.object({
  Comment: Joi.string().required(),
  rating: Joi.number().required().min(0).max(5),
  createdAt: Joi.date().default(Date.now),
}).required();

// ------------------ user schema

export const userJoiSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(25),
});
