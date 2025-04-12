from flask import Flask, request, jsonify
from flask_cors import CORS  # Импортируем Flask-CORS
import openai

app = Flask(__name__)
CORS(app)  # Применяем CORS ко всему приложению

# Настройка для обращения к локальному LLM-серверу
openai.api_base = "http://127.0.0.1:1234/v1"
openai.api_key = "test-key"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"response": "Сообщение не передано."}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.8,
            max_tokens=1024
        )
        reply_text = response.choices[0].message.content
        return jsonify({"response": reply_text})
    except Exception as e:
        return jsonify({"response": f"Ошибка при обработке запроса: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
