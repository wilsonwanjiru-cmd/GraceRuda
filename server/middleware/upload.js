// server/middleware/upload.js
// server/middleware/upload.js
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// ✅ Signed upload using API secret (no upload_preset)
const uploadToCloudinary = (buffer, folder = 'ruda') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${folder}/profiles`,   // e.g., 'ruda/profiles'
        resource_type: 'image',
        transformation: [{ quality: 'auto' }],
        // No upload_preset – signature will be generated from API secret
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

module.exports = { upload, uploadToCloudinary };