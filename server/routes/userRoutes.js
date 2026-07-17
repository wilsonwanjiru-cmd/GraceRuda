// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateProfile,
    uploadPhoto,
    deletePhoto,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.post('/upload-photo', protect, upload.single('photo'), uploadPhoto);
router.delete('/photo', protect, deletePhoto);

module.exports = router;