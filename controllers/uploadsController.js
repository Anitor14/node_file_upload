const path = require("path");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

const uploadProductImageLocal = async (req, res) => {
  // check size
  //check if the file exist
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  const productImage = req.files.image; // this returns an array of the file properties.
  console.log(productImage);
  // check format
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (!productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "please upload image smaller than 1kb"
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload", // the folder on cloudinary where you want to store the image.
    }
  );
  console.log(result);
  fs.unlinkSync(req.files.image.tempFilePath);
  // console.log(result);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const uploadImageToDigitalOcean = async (req, res) => {
  res.send("upload image is working");
};

module.exports = {
  uploadProductImage,
  uploadImageToDigitalOcean,
};
