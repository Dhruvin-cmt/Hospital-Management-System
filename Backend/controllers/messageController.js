import express, { json } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    throw new console.error("Provide require details!");
  }

  await Message.create({ firstName, lastName, email, phone, message });

  res.status(200).json({
    success: true,
    message: "Message Sent Succesfully!",
  });
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find();

//   console.log(messages);

  res.status(200).json({
    success: true,
    messages,
  });
});
