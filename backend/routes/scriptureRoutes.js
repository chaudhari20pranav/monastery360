const express   = require('express');
const router    = express.Router();
const Scripture = require('../models/Scripture');

router.get('/', async (req, res) => {
  try {
    const scriptures = await Scripture.find();
    res.status(200).json({ success: true, count: scriptures.length, data: scriptures });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const q = req.params.query;
    const scriptures = await Scripture.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { origin: { $regex: q, $options: 'i' } },
        { significance: { $regex: q, $options: 'i' } }
      ]
    });
    res.status(200).json({ success: true, count: scriptures.length, data: scriptures });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scripture = await Scripture.findById(req.params.id);
    if (!scripture) return res.status(404).json({ success: false, error: 'Scripture not found' });
    res.status(200).json({ success: true, data: scripture });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
