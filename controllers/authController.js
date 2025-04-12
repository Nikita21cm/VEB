// controllers/authController.js
const userModel = require('../models/userModel');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Проверяем, существует ли уже пользователь по email
    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    const newUser = await userModel.createUser(username, email, password);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Неверные учётные данные' });
    }
    // В простейшем варианте возвращаем данные пользователя
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { register, login };
