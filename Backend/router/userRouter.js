import express from "express";
import { addNewDoctor, adminRegister, getallDoctors, login, patientRegister } from "../controllers/userController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router()

router.post("/patient/register", patientRegister)
router.post("/login", login)
router.post("/admin/register", adminRegister)
router.post("/admin/addnewdoctor", isAdminAuthenticated, addNewDoctor)
router.get("/getalldoctors", getallDoctors)

export default router