// server/controllers/userController.js
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

// @desc    Get all users (with filters)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const { ageMin, ageMax, gender, city, search } = req.query;
        const currentUser = req.user;

        const filter = {
            _id: { $ne: currentUser._id },
            isVerified: true,
            isBlocked: false,
        };

        // Gender-based feed logic
        if (currentUser.gender === 'male') {
            filter.gender = 'female';
        } else if (currentUser.gender === 'female') {
            filter.gender = 'male';
        }

        if (gender) {
            filter.gender = gender;
        }

        if (ageMin || ageMax) {
            filter.age = {};
            if (ageMin) filter.age.$gte = parseInt(ageMin);
            if (ageMax) filter.age.$lte = parseInt(ageMax);
        }

        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        if (search) {
            filter.$or = [
                { fullname: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ];
        }

        // Sort by premium first, then by last active
        const users = await User.find(filter)
            .select('-password')
            .sort({ premium: -1, lastActive: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            age,
            city,
            bio,
            occupation,
            height,
            weight,
            bodyType,
            smoking,
            drinking,
            religion,
            education,
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullname = fullname || user.fullname;
        user.age = age || user.age;
        user.city = city || user.city;
        user.bio = bio || user.bio;
        user.occupation = occupation || user.occupation;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.bodyType = bodyType || user.bodyType;
        user.smoking = smoking || user.smoking;
        user.drinking = drinking || user.drinking;
        user.religion = religion || user.religion;
        user.education = education || user.education;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload photo
// @route   POST /api/users/upload-photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.photos.length >= 6) {
            return res.status(400).json({ message: 'Maximum 6 photos allowed' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'ruda/profiles');
        user.photos.push(result.secure_url);
        await user.save();

        res.json({ photos: user.photos, message: 'Photo uploaded successfully' });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete photo
// @route   DELETE /api/users/photo
exports.deletePhoto = async (req, res) => {
    try {
        const { photoUrl } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.photos = user.photos.filter((p) => p !== photoUrl);
        await user.save();

        res.json({ photos: user.photos, message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};