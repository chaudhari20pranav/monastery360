const express = require('express');
const router  = express.Router();
const { getFestivals, getFestivalsByMonth, getFestivalsByYear, getFestival, createFestival, updateFestival, deleteFestival } = require('../controllers/festivalController');

router.get('/',                   getFestivals);
router.get('/month/:year/:month', getFestivalsByMonth);
router.get('/year/:year',         getFestivalsByYear);
router.get('/:id',                getFestival);
router.post('/',                  createFestival);
router.put('/:id',                updateFestival);
router.delete('/:id',             deleteFestival);

module.exports = router;
