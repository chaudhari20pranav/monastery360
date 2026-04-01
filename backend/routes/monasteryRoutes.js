const express = require('express');
const router  = express.Router();
const { getMonasteries, getMonastery, searchMonasteries, createMonastery, updateMonastery, deleteMonastery } = require('../controllers/monasteryController');

router.route('/').get(getMonasteries).post(createMonastery);
router.route('/search/:query').get(searchMonasteries);
router.route('/:id').get(getMonastery).put(updateMonastery).delete(deleteMonastery);

module.exports = router;
