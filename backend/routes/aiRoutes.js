const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { summarize, transcribe } = require('../controllers/aiController');

// Admin or authenticated users can use these endpoints; keep rate-limited in server.
router.post('/summarize', protect, summarize);
router.post('/transcribe', protect, transcribe);

module.exports = router;
