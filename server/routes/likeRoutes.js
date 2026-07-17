// server/routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const { likeUser, unlikeUser, getLikes } = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getLikes);
router.post('/', protect, likeUser);
router.delete('/:userId', protect, unlikeUser);

module.exports = router;
