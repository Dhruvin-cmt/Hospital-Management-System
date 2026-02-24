import express from "express";
import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import ErrorHandler from "../middlewares/error.js";

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, pincode, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !pincode ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Provide required details", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already exist!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    password,
    role: "Patient",
  });

  await generateToken(user, "Patient register succesfully", 202, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  // console.log(req.body);

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Fill all require details", 400));
  }

  if (password != confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm-Password do not match", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("User did not exist, Please register first!", 400)
    );
  }
  //   console.log(password);
  //   console.log(user);
  const isPasswordMatch = await user.comparePassword(password);
  //   console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is invalid!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }

  generateToken(user, "Login Successfully!", 201, res);
});

export const adminRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, pincode, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !pincode ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Provide required details", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already exist!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    password,
    role: "Admin",
  });

  await generateToken(admin, "Patient register succesfully", 202, res);
});

export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    password,
    docDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !pincode ||
    !gender ||
    !password ||
    !docDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Provide ALL Details!", 400));
  }

  const docRegistered = await User.findOne({ email });
  if (docRegistered) {
    return next(new ErrorHandler("Doctor with this email already exist!", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    password,
    role: "Doctor",
    docDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    doctor,
    message: "Doctor registered succesfully!",
  });
});

export const getallDoctors = catchAsyncError(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });

  res.status(200).json({
    success: true,
    doctors,
    message: "List of all doctors!",
  });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
    message: "User Information",
  });
});

export const patientLogout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("patienttoken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Patient Logout SuccesFully!",
    });
});

export const adminLogout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("admintoken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Admin Logout SuccesFully!",
    });
});
