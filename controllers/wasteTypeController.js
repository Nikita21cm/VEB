// controllers/wasteTypeController.js
const wasteTypeModel = require('../models/wasteTypeModel');

const getWasteTypes = async (req, res) => {
  try {
    const types = await wasteTypeModel.getAllWasteTypes();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWasteType = async (req, res) => {
  const { type_name, description } = req.body;
  try {
    const newType = await wasteTypeModel.addWasteType(type_name, description);
    res.status(201).json(newType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWasteTypeCtrl = async (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;
  try {
    const updatedType = await wasteTypeModel.updateWasteType(id, type_name, description);
    res.status(200).json(updatedType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWasteTypeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await wasteTypeModel.deleteWasteType(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWasteTypes, createWasteType, updateWasteTypeCtrl, deleteWasteTypeCtrl };
