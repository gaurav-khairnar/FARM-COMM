const express = require('express');
const {
  createListing,
  updateListing,
  deactivateListing,
  getMyListings,
  getFeed,
  getListingById
} = require('../controllers/listingController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/feed', getFeed);
router.get('/my', auth, requireRole('farmer', 'admin'), getMyListings);
router.get('/:id', getListingById);
router.post('/', auth, requireRole('farmer', 'admin'), createListing);
router.put('/:id', auth, requireRole('farmer', 'admin'), updateListing);
router.patch('/:id/deactivate', auth, requireRole('farmer', 'admin'), deactivateListing);

module.exports = router;
