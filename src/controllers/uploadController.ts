import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const file = req.files.file;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "fashion-store/products",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Cloudinary upload failed",
            error: error.message,
          });
        }

        res.status(200).json({
          message: "File uploaded to Cloudinary",
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(file.data);
  } catch (error) {
    res.status(500).json({
      message: "Upload error",
      error: error.message,
    });
  }
};
