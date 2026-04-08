// import packages
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { adminRoute } from './router/admin.route.js';

// variables and middleware
dotenv.config({ quiet: true });
const app = express();
app.use(express.json()) // parse and work with json data
const PORT = process.env.PORT;


// set the admin route
app.use("/admin-auth", adminRoute);


// creating server
connectDB().then(() =>
  app.listen(PORT, () => {
    console.log(`server start\nhttp://localhost:${PORT}`);
  }))