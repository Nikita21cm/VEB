// controllers/contributionController.js
const db = require('../config/db');

const getContribution = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ message: 'Не указан user_id' });
  }
  // Расчет по суммарному весу отходов
  db.get("SELECT SUM(weight) as total_weight FROM waste_reports WHERE user_id = ?", [user_id], (err, row) => {
    if(err) return res.status(500).json({ message: err.message });
    const totalWeight = row.total_weight || 0;
    const points = totalWeight * 10; // Например, очки = вес * 10
    res.status(200).json({ totalWeight, points });
  });
};

module.exports = { getContribution };
