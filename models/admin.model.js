import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
    trim: true,
    minlength: 3
  },
  email: {
    required: true,
    unique: true,
    type: String,
    trim: true
  },
  phone: {
    required: true,
    type: String,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    trim: true,
    minlength: 6
  },
},
{
  timestamps: true
});

export const Admin = mongoose.model("Admin", adminSchema);