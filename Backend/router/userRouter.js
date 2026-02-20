import express from "express";
import {
  addNewDoctor,
  adminLogout,
  adminRegister,
  getallDoctors,
  getUserDetails,
  login,
  patientLogout,
  patientRegister,
} from "../controllers/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/register", adminRegister);
router.post("/admin/addnewdoctor", isAdminAuthenticated, addNewDoctor);
router.get("/getalldoctors", getallDoctors);
router.get("/patient/details", isPatientAuthenticated, getUserDetails);
router.get("/admin/details", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, patientLogout)
router.get("/admin/logout", isAdminAuthenticated, adminLogout)

export default router;
