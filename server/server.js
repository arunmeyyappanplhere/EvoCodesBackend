const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const route = require("./routes/routes");
const connectDB = require("./config/db");
const projects = require("./models/projects");
const app = express();
app.use(express.json());


const connectToDB = async () => {
  try {
    await connectDB().then(
      app.listen(process.env.PORT, () => {
        console.log(`Server is running at http:/localhost:${process.env.PORT}`);
      }),
    );
  } catch (err) {
    console.log("Error in starting sever : " + err);
  }
};

connectToDB();

app.use("/api", route);





