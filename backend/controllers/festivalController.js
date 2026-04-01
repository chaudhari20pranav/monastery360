const Festival = require('../models/Festival');

const getFestivals = async (req, res) => {
  try {
    const festivals = await Festival.find().populate('monastery', 'name location').sort({ date: 1 });
    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFestivalsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 0, 23, 59, 59);
    const festivals = await Festival.find({ date: { $gte: startDate, $lte: endDate } })
      .populate('monastery', 'name location').sort({ date: 1 });
    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFestivalsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const startDate = new Date(year, 0, 1);
    const endDate   = new Date(year, 11, 31, 23, 59, 59);
    const festivals = await Festival.find({ date: { $gte: startDate, $lte: endDate } })
      .populate('monastery', 'name location').sort({ date: 1 });
    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFestival = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id).populate('monastery', 'name location');
    if (!festival) return res.status(404).json({ success: false, error: 'Festival not found' });
    res.status(200).json({ success: true, data: festival });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createFestival = async (req, res) => {
  try {
    const festival = await Festival.create(req.body);
    res.status(201).json({ success: true, data: festival });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateFestival = async (req, res) => {
  try {
    const festival = await Festival.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('monastery', 'name location');
    if (!festival) return res.status(404).json({ success: false, error: 'Festival not found' });
    res.status(200).json({ success: true, data: festival });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteFestival = async (req, res) => {
  try {
    const festival = await Festival.findByIdAndDelete(req.params.id);
    if (!festival) return res.status(404).json({ success: false, error: 'Festival not found' });
    res.status(200).json({ success: true, message: 'Festival deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getFestivals, getFestivalsByMonth, getFestivalsByYear, getFestival, createFestival, updateFestival, deleteFestival };
