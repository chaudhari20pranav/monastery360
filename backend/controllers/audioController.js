const path     = require('path');
const fs       = require('fs');
const Monastery = require('../models/Monastery');

const VALID_LANGUAGES = ['en', 'hi', 'ne', 'bo', 'zh'];

const getAudio = async (req, res) => {
  try {
    const { monasteryId, languageCode } = req.params;
    if (!VALID_LANGUAGES.includes(languageCode)) {
      return res.status(400).json({ success: false, error: 'Invalid language code' });
    }
    const monastery = await Monastery.findById(monasteryId);
    if (!monastery) return res.status(404).json({ success: false, error: 'Monastery not found' });

    const audioPath = monastery.audio[languageCode];
    if (!audioPath) return res.status(404).json({ success: false, error: `No audio for language: ${languageCode}` });

    const filePath = path.join(__dirname, '../public', audioPath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: 'Audio file not found on server' });

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error retrieving audio' });
  }
};

const getMonasteryAudios = async (req, res) => {
  try {
    const monastery = await Monastery.findById(req.params.monasteryId);
    if (!monastery) return res.status(404).json({ success: false, error: 'Monastery not found' });
    res.status(200).json({ success: true, data: monastery.audio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getAudio, getMonasteryAudios };
