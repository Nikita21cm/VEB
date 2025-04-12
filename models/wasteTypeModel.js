// models/wasteTypeModel.js
const db = require('../config/db');

const getAllWasteTypes = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM waste_types", [], (err, rows) => {
      if(err) return reject(err);
      resolve(rows);
    });
  });
};

const addWasteType = (type_name, description) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO waste_types (type_name, description) VALUES (?, ?)";
    db.run(query, [type_name, description], function(err) {
      if(err) return reject(err);
      db.get("SELECT * FROM waste_types WHERE id = ?", [this.lastID], (err, row) => {
        if(err) return reject(err);
        resolve(row);
      });
    });
  });
};

const updateWasteType = (id, type_name, description) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE waste_types SET type_name = ?, description = ? WHERE id = ?";
    db.run(query, [type_name, description, id], function(err) {
      if(err) return reject(err);
      db.get("SELECT * FROM waste_types WHERE id = ?", [id], (err, row) => {
        if(err) return reject(err);
        resolve(row);
      });
    });
  });
};

const deleteWasteType = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM waste_types WHERE id = ?", [id], function(err) {
      if(err) return reject(err);
      resolve({ deleted: true });
    });
  });
};

module.exports = { getAllWasteTypes, addWasteType, updateWasteType, deleteWasteType };
