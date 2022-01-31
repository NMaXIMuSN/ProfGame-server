require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const formData = require('express-form-data');
const router = require("./router/index.js");
const routerImg = require("./router/img.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddelwaer = require("./middelwaers/error-middelwaer");

const PORT = "5000";
const URL_BD =
  "mongodb+srv://admin:admin123@cluster0.b5klu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.URL_CLIENT,
  })
);
app.use(cookieParser());
app.use(formData.parse());
app.use(express.json());
app.use("/uploads", routerImg);
app.use("/api", router);
app.use(errorMiddelwaer);

async function startApp() {
  try {
    await mongoose.connect(URL_BD, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () => {
      console.log("SERVE STARTED ");
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
