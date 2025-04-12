// routes/wasteTypeRoutes.js
const express = require('express');
const router = express.Router();
const wasteTypeController = require('../controllers/wasteTypeController');

router.get('/waste_types', wasteTypeController.getWasteTypes);
router.post('/waste_types', wasteTypeController.createWasteType);
router.put('/waste_types/:id', wasteTypeController.updateWasteTypeCtrl);
router.delete('/waste_types/:id', wasteTypeController.deleteWasteTypeCtrl);

module.exports = router;
