const { cloudinary } = require("../config/cloudinary");

async function uploadEmployeePhoto(imageInput) {
  if (!imageInput) return null;

  const result = await cloudinary.uploader.upload(imageInput, {
    folder: "employee_photos",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

module.exports = { uploadEmployeePhoto };