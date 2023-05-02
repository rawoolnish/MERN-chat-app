const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { allMessaages, sendMessage } = require('../controllers/messageControllers');
const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessaages);

module.exports = router;