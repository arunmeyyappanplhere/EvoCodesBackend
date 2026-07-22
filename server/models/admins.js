const mongoose = require("mongoose");

const adminModel = new mongoose.Schema(
  {
    userID: {
      type: String, // auto-generated, e.g. "ECA01"
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String, // stored hashed, never returned in responses
      required: true,
    },
    dateOfBirth: {
      type: String, // expects dd-mm-yyyy from the frontend as shown
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL / path to the uploaded profile image
      required: true,
    },
    companyCode: {
      type: String, // the invite code entered at registration
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admins", adminModel);