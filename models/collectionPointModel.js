// models/collectionPointModel.js
const db = require('../config/db');

const getAllCollectionPoints = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM collection_points", [], (err, rows) => {
      if(err) return reject(err);
      resolve(rows);
    });
  });
};

const searchCollectionPoints = (queryStr) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM collection_points WHERE location LIKE ?";
    db.all(query, [`%${queryStr}%`], (err, rows) => {
      if(err) return reject(err);
      resolve(rows);
    });
  });
};

const addCollectionPoint = (location, capacity) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO collection_points (location, capacity) VALUES (?, ?)";
    db.run(query, [location, capacity], function(err) {
      if(err) return reject(err);
      db.get("SELECT * FROM collection_points WHERE id = ?", [this.lastID], (err, row) => {
        if(err) return reject(err);
        resolve(row);
      });
    });
  });
};

const updateCollectionPoint = (id, location, capacity) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE collection_points SET location = ?, capacity = ? WHERE id = ?";
    db.run(query, [location, capacity, id], function(err) {
      if(err) return reject(err);
      db.get("SELECT * FROM collection_points WHERE id = ?", [id], (err, row) => {
        if(err) return reject(err);
        resolve(row);
      });
    });
  });
};

const deleteCollectionPoint = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM collection_points WHERE id = ?", [id], function(err) {
      if(err) return reject(err);
      resolve({ deleted: true });
    });
  });
};

module.exports = { getAllCollectionPoints, searchCollectionPoints, addCollectionPoint, updateCollectionPoint, deleteCollectionPoint };
