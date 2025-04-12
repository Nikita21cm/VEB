// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
// Если у вас Node.js >=18, можно использовать глобальный fetch.
// Если нет – установите и импортируйте node-fetch:
// const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY 

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Не передано сообщение" });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
         model: "gpt-4o-mini",
         messages: [
           { role: "system", content: "Ты помощник в области экологии и учета отходов. Помогай пользователю получать полезную информацию об экологической платформе." },
           { role: "user", content: message }
         ],
         max_tokens: 150
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    const reply = data.choices[0].message.content;
    return res.json({ reply });
  } catch (error) {
    console.error("Ошибка при вызове OpenAI:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
