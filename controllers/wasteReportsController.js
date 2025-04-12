// controllers/wasteReportsController.js
const wasteReportModel = require('../models/wasteReportModel');

const getReports = async (req, res) => {
  // Если передан user_id через query, то возвращаем отчёты этого пользователя
  const user_id = req.query.user_id;
  try {
    if (!user_id) {
      return res.status(400).json({ message: 'Не указан user_id' });
    }
    const reports = await wasteReportModel.getAllReportsByUser(user_id);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const createReport = async (req, res) => {
  const { user_id, waste_type_id, collection_point_id, weight, report_date } = req.body;
  try {
    const newReport = await wasteReportModel.addReport(user_id, waste_type_id, collection_point_id, weight, report_date);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const updateReport = async (req, res) => {
  const { id } = req.params;
  const { user_id, waste_type_id, collection_point_id, weight, report_date } = req.body;
  try {
    const updatedReport = await wasteReportModel.updateReport(id, user_id, waste_type_id, collection_point_id, weight, report_date);
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await wasteReportModel.deleteReport(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { getReports, createReport, updateReport, deleteReport };
