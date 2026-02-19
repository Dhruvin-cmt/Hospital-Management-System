import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";

export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.admintoken;

  if (!token) {
    return next(new ErrorHandler("Admin is not Authenticated", 400));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);

  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler("User does not have permission this information", 400)
    );
  }
  next();
});
