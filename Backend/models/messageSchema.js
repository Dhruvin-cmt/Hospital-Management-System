import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
  message: {
    type: String,
    require: true,
    minLength: [10, "Message must contain atleat 10 characters!"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
