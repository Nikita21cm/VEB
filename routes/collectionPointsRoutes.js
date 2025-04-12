// routes/collectionPointsRoutes.js
const express = require('express');
const router = express.Router();
const collectionPointsController = require('../controllers/collectionPointsController');

router.get('/collection_points', collectionPointsController.getCollectionPoints);
router.post('/collection_points', collectionPointsController.createCollectionPoint);
router.put('/collection_points/:id', collectionPointsController.updateCollectionPointCtrl);
router.delete('/collection_points/:id', collectionPointsController.deleteCollectionPointCtrl);

module.exports = router;
