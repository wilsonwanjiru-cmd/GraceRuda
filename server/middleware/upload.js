// server/middleware/upload.js

const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

// Store files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const hasValidExtension = allowedExtensions.test(
    path.extname(file.originalname)
  );

  const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);

  if (hasValidExtension && hasValidMimeType) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG, GIF and WEBP images are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "ruda/profiles") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};