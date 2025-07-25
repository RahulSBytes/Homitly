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

// ---------------booking

export const bookingJoiSchema = Joi.object({
  checkin: Joi.date().required().min("now").messages({
    "date.base": "Check-in date must be a valid date",
    "date.min": "Check-in date must be today or in the future",
  }),

  checkout: Joi.date()
    .required()
    .min("now")
    .greater(Joi.ref("checkin"))
    .messages({
      "date.base": "checkout date must be a valid date",
      "date.min": "checkout date must be today or in the future"
    }),

  mobileNumber: Joi.string()
    .required()
    .pattern(/^\+\d{1,3}\d{6,14}$/)
    .messages({
      "string.base": "Mobile number must be a string",
      "string.pattern.base":
        "Mobile number must be in format +[country code][number] (e.g., +1234567890)",
    }),

  numberOfGuests: Joi.number().integer().min(1).max(20),
});
