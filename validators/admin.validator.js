import {z} from 'zod';

export const adminSignupSchema = z.object({
  username: z.string({message: "username is required"})
    .trim()
    .min(3, {message: "username must be at least 3 character"})
    .max(255, {message: "username not more than 255 character"}),
  email: z.string({message: "email is required"})
  .trim()
  .email({message: "invalid email address"}),
  phone: z.string({message: "phone number is required"})
    .trim()
    .min(10, {message: "phone number at least 10 character"})
    .max(20, {message: "phone number not more than 20 character"}),
  password: z.string({message: "password is required"})
    .trim()
    .min(7, {message: "password at least 7 character"})
})