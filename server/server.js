const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const route = require("./routes/routes");
const connectDB = require("./config/db");
const projects = require("./models/projects");
const app = express();
app.use(express.json());

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





