const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["user", "coach", "admin"],
    default: "user"
  },

  phone: String,
  address: String,
  avatar: String,

  resetPasswordToken:  String,
  resetPasswordExpiry: Date,
 

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);