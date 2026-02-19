import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Database Connected Succesfully!");
    })
    .catch((err) => {
      console.log("Error in connecting with database", err);
    });
};
