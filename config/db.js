// config/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Ошибка при подключении к БД:", err.message);
  } else {
    console.log("Подключение к базе данных SQLite успешно");
  }
});

// Создание таблиц, если их еще нет
db.serialize(() => {
  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
  
  // Таблица пунктов приёма
  db.run(`CREATE TABLE IF NOT EXISTS collection_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    capacity INTEGER
  )`);
  
  // Таблица отчетов об отходах
  db.run(`CREATE TABLE IF NOT EXISTS waste_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    waste_type_id INTEGER,
    collection_point_id INTEGER,
    weight REAL,
    report_date TEXT
  )`);
  
  // Таблица типов отходов
  db.run(`CREATE TABLE IF NOT EXISTS waste_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_name TEXT NOT NULL,
    description TEXT
  )`);
});
module.exports = db;
