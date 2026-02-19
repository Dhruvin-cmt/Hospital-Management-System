import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    minLength: [3, "First Name must contain atleat 3 characters!"],
  },
  lastName: {
    type: String,
    require: true,
    minLength: [3, "Last Name must contain atleat 3 characters!"],
  },
  email: {
    type: String,
    require: true,
    validate: [validator.isEmail, "Provide valid email address!"],
  },
  phone: {
    type: String,
    require: true,
    minLength: [9, "Phone number must contain exact 9 characters!"],
    maxLength: [9, "Phone number must contain exact 9 characters!"],
  },
  dob: {
    type: String,
    require: [true, "DOB is required"],
  },
  pincode: {
    type: Number,
    require: true,
    minLength: [5, "Pincode must contain exact 5 digits!"],
    minLength: [5, "Pincode must contain exact 5 digits!"],
  },
  gender: {
    type: String,
    require: true,
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    require: true,
    minLength: [8, "Password must contain atleast 8 characters"],
    select: false,
  },
  docDepartment: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    enum: ["Admin", "Patient", "Doctor"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
