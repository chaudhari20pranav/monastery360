const express = require('express');
const router  = express.Router();
const path    = require('path');
const { getAudio, getMonasteryAudios } = require('../controllers/audioController');

router.use('/files', express.static(path.join(__dirname, '../public/audio')));
router.get('/monastery/:monasteryId/language/:languageCode', getAudio);
router.get('/monastery/:monasteryId', getMonasteryAudios);

module.exports = router;
