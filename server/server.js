const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routes/routes");
const connectDB = require("./config/db");
const projects = require("./models/projects");
const app = express();

// credentials: true is required for the browser to send/receive the httpOnly
// auth cookie. origin must be the exact frontend URL (not "*") when using credentials.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Register routes BEFORE starting the server
app.use("/api", route);

const connectToDB = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at http:/localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error in starting sever : " + err);
  }
};

connectToDB();