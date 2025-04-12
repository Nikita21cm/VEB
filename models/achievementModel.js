// models/achievementModel.js
const db = require('../config/db');
const wasteReportModel = require('./wasteReportModel');

const getAchievementsForUser = async (user_id) => {
  // Получаем количество отчётов пользователя
  const count = await wasteReportModel.getReportsCountByUser(user_id);
  // Получаем список всех достижений
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM achievements", [], (err, achievements) => {
      if (err) return reject(err);
      // Фильтруем те, для которых выполнен порог
      const earned = achievements.filter(a => count >= a.threshold);
      resolve({ reportsCount: count, achievements: earned });
    });
  });
};

module.exports = { getAchievementsForUser };
