const path = require("path");

const { StatusCodes } = require("http-status-codes");

const uploadProductImage = async (req, res) => {
  const productImage = req.files.image; // this returns an array of the file properties.
  console.log(productImage);
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = {
  uploadProductImage,
};
