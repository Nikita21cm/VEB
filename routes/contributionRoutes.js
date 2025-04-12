// routes/contributionRoutes.js
const express = require('express');
const router = express.Router();
const { getContribution } = require('../controllers/contributionController');

router.get('/contribution', getContribution);

module.exports = router;
