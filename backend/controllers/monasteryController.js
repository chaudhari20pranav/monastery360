const Monastery = require('../models/Monastery');

const getMonasteries = async (req, res) => {
  try {
    const monasteries = await Monastery.find({ isActive: true });
    res.status(200).json({ success: true, count: monasteries.length, data: monasteries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findById(req.params.id);
    if (!monastery) return res.status(404).json({ success: false, error: 'Monastery not found' });
    res.status(200).json({ success: true, data: monastery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const searchMonasteries = async (req, res) => {
  try {
    const monasteries = await Monastery.find({
      isActive: true,
      $text: { $search: req.params.query }
    });
    res.status(200).json({ success: true, count: monasteries.length, data: monasteries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.create(req.body);
    res.status(201).json({ success: true, data: monastery });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!monastery) return res.status(404).json({ success: false, error: 'Monastery not found' });
    res.status(200).json({ success: true, data: monastery });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!monastery) return res.status(404).json({ success: false, error: 'Monastery not found' });
    res.status(200).json({ success: true, message: 'Monastery deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getMonasteries, getMonastery, searchMonasteries, createMonastery, updateMonastery, deleteMonastery };
