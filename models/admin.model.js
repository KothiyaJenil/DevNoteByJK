import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

adminSchema.pre('save', async function(next){
  const admin = this;

  if(!admin.isModified('password')){
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashPassword;
  } catch (error) {
    next(error);
  }
})

export const Admin = mongoose.model("Admin", adminSchema);