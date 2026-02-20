import express from "express";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
import { deleteApplication, getAllAppointments, postApplication, updateAppointmentStatus } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/apply", isPatientAuthenticated, postApplication)
router.get("/getall", isAdminAuthenticated, getAllAppointments)
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus)
router.delete("/delete/:id", isAdminAuthenticated, deleteApplication)

export default router;
