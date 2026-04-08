import { Router } from "express";
import { adminSignup } from "../controllers/admin.controller.js";
import { adminValidate } from "../middlewares/validate.middleware.js";
import { adminSignupSchema } from "../validators/admin.validator.js";

export const adminRoute = Router();

adminRoute.route("/admin-signup").post(adminValidate(adminSignupSchema), adminSignup);