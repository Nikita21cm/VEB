// controllers/dashboardController.js
const wasteReportModel = require('../models/wasteReportModel');
const achievementModel = require('../models/achievementModel');

const getDashboardData = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ message: 'Не указан user_id' });
  }
  try {
    const reports = await wasteReportModel.getAllReportsByUser(user_id);
    const achievements = await achievementModel.getAchievementsForUser(user_id);
    res.status(200).json({ reports, achievements });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { getDashboardData };
