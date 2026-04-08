import { Router } from "express";
import { adminSignup } from "../controllers/admin.controller.js";

export const adminRoute = Router();

adminRoute.route("/admin-signup").post(adminSignup);