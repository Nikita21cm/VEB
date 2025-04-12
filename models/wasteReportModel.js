// models/wasteReportModel.js
const db = require('../config/db');

const getAllReportsByUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM waste_reports WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const addReport = (user_id, waste_type_id, collection_point_id, weight, report_date) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO waste_reports (user_id, waste_type_id, collection_point_id, weight, report_date)
                   VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [user_id, waste_type_id, collection_point_id, weight, report_date], function(err) {
      if (err) return reject(err);
      db.get("SELECT * FROM waste_reports WHERE id = ?", [this.lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  });
};

const updateReport = (id, user_id, waste_type_id, collection_point_id, weight, report_date) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE waste_reports 
                   SET user_id = ?, waste_type_id = ?, collection_point_id = ?, weight = ?, report_date = ?
                   WHERE id = ?`;
    db.run(query, [user_id, waste_type_id, collection_point_id, weight, report_date, id], function(err) {
      if (err) return reject(err);
      db.get("SELECT * FROM waste_reports WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  });
};

const deleteReport = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM waste_reports WHERE id = ?";
    db.run(query, [id], function(err) {
      if (err) return reject(err);
      resolve({ deleted: true });
    });
  });
};

const getReportsCountByUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM waste_reports WHERE user_id = ?", [user_id], (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
};

module.exports = { getAllReportsByUser, addReport, updateReport, deleteReport, getReportsCountByUser };
