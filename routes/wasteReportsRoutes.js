// routes/wasteReportsRoutes.js
const express = require('express');
const router = express.Router();
const wasteReportsController = require('../controllers/wasteReportsController');

router.get('/reports', wasteReportsController.getReports);
router.post('/reports', wasteReportsController.createReport);
router.put('/reports/:id', wasteReportsController.updateReport);
router.delete('/reports/:id', wasteReportsController.deleteReport);

module.exports = router;
