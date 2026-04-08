import { Admin } from "../models/admin.model.js";

export const adminSignup = async (req, res) => {
  const admin = req.body;
  try {
    console.log(req.body);

    const adminExist = await Admin.findOne({ email: admin.email });

    if (adminExist) {
      res.json(400).json({ message: "email already exist" });
    }

    const adminCreate = await Admin.create(admin);

    if (adminCreate) {
      res.status(200).json({ message: "admin signup successfully" });
    }


  } catch (error) {
    next(error);
  }
}