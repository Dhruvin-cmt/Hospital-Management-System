import mongoose from "mongoose";
import validator from "validator";
import { User } from "./userSchema.js";

const appointmentSchema = new mongoose.Schema({
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
  docDepartment: {
    type: String,
  },
  appointmentDate: {
    type: String,
    require: [true, "Appointment date is required!"],
  },
  doctor: {
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
  },
  address: {
    type: String,
    require: [true, "Adress is required!"],
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    require: [true, "Doctor Id is invalid"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    require: [true, "Patient Id is invalid"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
