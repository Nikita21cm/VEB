// server.js
const express = require('express');
const path = require('path');
const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Отдача статических файлов из каталога "public"
app.use(express.static('public'));

// Подключаем маршруты
const authRoutes = require('./routes/authRoutes');
const wasteReportsRoutes = require('./routes/wasteReportsRoutes');
const collectionPointsRoutes = require('./routes/collectionPointsRoutes');
const wasteTypeRoutes = require('./routes/wasteTypeRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

app.use('/api', authRoutes);
app.use('/api', wasteReportsRoutes);
app.use('/api', collectionPointsRoutes);
app.use('/api', wasteTypeRoutes);
app.use('/api', contributionRoutes);

// Если обращение к корню, отдаем index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
