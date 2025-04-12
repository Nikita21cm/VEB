// models/userModel.js
const db = require('../config/db');

const createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.run(query, [username, email, password], function(err) {
      if (err) return reject(err);
      db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

module.exports = { createUser, getUserByEmail };
