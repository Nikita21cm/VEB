// controllers/collectionPointsController.js

const collectionPointModel = require('../models/collectionPointModel');

// Получение пунктов приёма с поддержкой поиска через query-параметр "q"
const getCollectionPoints = async (req, res) => {
  try {
    let points;
    const query = req.query.q ? req.query.q.trim() : "";
    if (query) {
      points = await collectionPointModel.searchCollectionPoints(query);
    } else {
      points = await collectionPointModel.getAllCollectionPoints();
    }
    res.status(200).json(points);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Добавление нового пункта приёма
const createCollectionPoint = async (req, res) => {
  const { location, capacity } = req.body;
  if (!location || !capacity) {
    return res.status(400).json({ message: "Необходимо указать местоположение и вместимость." });
  }
  try {
    const newPoint = await collectionPointModel.addCollectionPoint(location, capacity);
    res.status(201).json(newPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление существующего пункта приёма
const updateCollectionPointCtrl = async (req, res) => {
  const { id } = req.params;
  const { location, capacity } = req.body;
  if (!location || !capacity) {
    return res.status(400).json({ message: "Для обновления необходимо указать местоположение и вместимость." });
  }
  try {
    const updatedPoint = await collectionPointModel.updateCollectionPoint(id, location, capacity);
    res.status(200).json(updatedPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удаление пункта приёма
const deleteCollectionPointCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await collectionPointModel.deleteCollectionPoint(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCollectionPoints,
  createCollectionPoint,
  updateCollectionPointCtrl,
  deleteCollectionPointCtrl,
};
