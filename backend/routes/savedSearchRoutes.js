const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { listSavedSearches, createSavedSearch, updateSavedSearch, deleteSavedSearch } = require('../controllers/savedSearchController');

router.get('/', protect, listSavedSearches);
router.post('/', protect, createSavedSearch);
router.put('/:id', protect, updateSavedSearch);
router.delete('/:id', protect, deleteSavedSearch);

module.exports = router;
