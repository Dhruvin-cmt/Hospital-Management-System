import express from "express";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const postApplication = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    docDepartment,
    appointmentDate,
    doctor_firstName,
    doctor_lastName,
    address,
    hasVisited,
  } = req.body;

  // console.log(req.body);

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !pincode ||
    !gender ||
    !docDepartment ||
    !appointmentDate ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address 
  ) {
    return next(
      new ErrorHandler("Fill all required details of application!", 400)
    );
  }

  const isConfict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    docDepartment: docDepartment,
  });

  // console.log("first",isConfict);

  if (isConfict === 0) {
    return next(new ErrorHandler("Doctor not found!", 400));
  }

  if (isConfict > 1) {
    return next(
      new ErrorHandler(
        "Multiple Doctors with same properties please contact through email or phone!",
        503
      )
    );
  }

  const doctorId = isConfict[0]._id;
  // console.log(doctorId)
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    pincode,
    gender,
    docDepartment,
    appointmentDate,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    doctorId,
    patientId,
    address,
    hasVisited,
  });

  res.status(200).json({
    success: true,
    message: "Application submit succesfully!",
    appointment,
  });
});

export const getAllAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find();

  res.status(200).json({
    success: true,
    message: "All Appointments are here!",
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 400));
    }

    appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: req.body.status },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Appointment Updated Succesfully!",
      appointment,
    });
  }
);

export const deleteApplication = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  //   console.log(req.params);

  let appointment = await Appointment.findById(id);
  //   console.log(appointment);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 400));
  }
  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment Deleted Succesfully!",
  });
});
