require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const AWS = require("aws-sdk");
const fs = require("fs");

const fileUpload = require("express-fileupload");
// always use v2
const cloudinary = require("cloudinary").v2;
// cloudinary configuration.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// database
const connectDB = require("./db/connect");
// product router
const productRouter = require("./routes/productRoutes");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.static("./public")); // give us access public contents.
app.use(express.json()); // invoking this gives us access to the json in the req.body.
app.use(fileUpload({ useTempFiles: true })); // invoking this gives us  access to the files from the req.body.

app.get("/", (req, res) => {
  res.send("<h1>File Upload Starter</h1>");
});

app.use("/api/v1/products", productRouter);
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
