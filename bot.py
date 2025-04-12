import telebot
from telebot import types
import sqlite3

# Укажите ваш токен, полученный через BotFather
TOKEN = '8141088914:AAHd5PN0G2-mWJrAWGRAozxdux6EL0dM-NM'
bot = telebot.TeleBot(TOKEN)

# Подключение к базе данных SQLite (файл database.sqlite должен находиться в той же директории)
conn = sqlite3.connect('database.sqlite', check_same_thread=False)
cursor = conn.cursor()

# Сессии пользователей: ключ – Telegram chat_id, значение – словарь с данными (user_id, username, email)
user_sessions = {}

# --------- Команда /start и первичная навигация ---------
@bot.message_handler(commands=['start'])
def handle_start(message):
    markup = types.InlineKeyboardMarkup(row_width=2)
    btn_login = types.InlineKeyboardButton("Войти в аккаунт", callback_data="login")
    btn_points = types.InlineKeyboardButton("Пункты приёма", callback_data="points")
    markup.add(btn_login, btn_points)
    bot.send_message(message.chat.id,
                     "Добро пожаловать в EcoNova Hub Bot!\nВыберите действие:",
                     reply_markup=markup)

# --------- Обработка inline-кнопок ---------
@bot.callback_query_handler(func=lambda call: True)
def callback_handler(call):
    if call.data == "login":
        msg = bot.send_message(call.message.chat.id, "Введите ваш email:")
        bot.register_next_step_handler(msg, process_email)
    elif call.data == "points":
        send_collection_points(call.message)
    elif call.data == "menu":
        show_main_menu(call.message.chat.id)
    elif call.data == "stats":
        show_stats(call.message)
    elif call.data == "reports":
        show_reports(call.message)
    elif call.data == "edit_reports":
        start_edit_reports(call.message)
    elif call.data == "logout":
        user_sessions.pop(call.message.chat.id, None)
        bot.send_message(call.message.chat.id, "Вы вышли из аккаунта.")
        handle_start(call.message)

# --------- Процесс входа пользователя ---------
def process_email(message):
    email = message.text.strip()
    # Сохраняем email в сессии
    user_sessions[message.chat.id] = {"email": email}
    msg = bot.send_message(message.chat.id, "Введите ваш пароль:")
    bot.register_next_step_handler(msg, process_password)

def process_password(message):
    password = message.text.strip()
    chat_id = message.chat.id
    session = user_sessions.get(chat_id, {})
    email = session.get("email")
    if not email:
        bot.send_message(chat_id, "Ошибка сессии. Начните заново через /start.")
        return
    # Проверка учётных данных
    cursor.execute("SELECT id, username, password FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    if not user:
        bot.send_message(chat_id, "Пользователь с таким email не найден.")
        return
    user_id, username, stored_password = user
    if password != stored_password:
        bot.send_message(chat_id, "Неверный пароль.")
        return
    # Сохраняем данные пользователя в сессии
    user_sessions[chat_id] = {"user_id": user_id, "username": username, "email": email}
    bot.send_message(chat_id, f"Добро пожаловать, {username}!")
    show_main_menu(chat_id)

# --------- Главное меню после входа ---------
def show_main_menu(chat_id):
    markup = types.InlineKeyboardMarkup(row_width=2)
    btn_stats = types.InlineKeyboardButton("Статистика", callback_data="stats")
    btn_reports = types.InlineKeyboardButton("Мои отчёты", callback_data="reports")
    btn_edit = types.InlineKeyboardButton("Редактировать отчёты", callback_data="edit_reports")
    btn_logout = types.InlineKeyboardButton("Выйти", callback_data="logout")
    markup.add(btn_stats, btn_reports, btn_edit, btn_logout)
    bot.send_message(chat_id, "Главное меню:", reply_markup=markup)

# --------- Функция вывода статистики (количество отчётов) ---------
def show_stats(message):
    chat_id = message.chat.id
    session = user_sessions.get(chat_id)
    if not session or "user_id" not in session:
        bot.send_message(chat_id, "Сначала войдите через /start -> Войти в аккаунт.")
        return
    user_id = session["user_id"]
    cursor.execute("SELECT COUNT(*) FROM waste_reports WHERE user_id = ?", (user_id,))
    count = cursor.fetchone()[0]
    bot.send_message(chat_id, f"У вас всего {count} отчётов.")

# --------- Функция вывода списка отчётов ---------
def show_reports(message):
    chat_id = message.chat.id
    session = user_sessions.get(chat_id)
    if not session or "user_id" not in session:
        bot.send_message(chat_id, "Сначала войдите в систему.")
        return
    user_id = session["user_id"]
    cursor.execute("SELECT id, waste_type_id, collection_point_id, weight, report_date FROM waste_reports WHERE user_id = ?", (user_id,))
    reports = cursor.fetchall()
    if not reports:
        bot.send_message(chat_id, "Отчёты отсутствуют.")
    else:
        reply = "Ваши отчёты:\n"
        for rep in reports:
            rep_id, waste_type, cp_id, weight, date = rep
            reply += f"ID: {rep_id} | Тип: {waste_type} | Пункт: {cp_id} | Вес: {weight} кг | Дата: {date}\n"
        bot.send_message(chat_id, reply)

# --------- Функция редактирования отчётов (запускаем процесс редактирования) ---------
def start_edit_reports(message):
    chat_id = message.chat.id
    bot.send_message(chat_id, "Введите ID отчёта, который хотите отредактировать:")
    bot.register_next_step_handler(message, process_edit_report_id)

def process_edit_report_id(message):
    try:
        report_id = int(message.text.strip())
    except ValueError:
        bot.send_message(message.chat.id, "Неверный формат ID. Попробуйте ещё раз.")
        return
    # Запрашиваем новые данные для редактирования отчёта
    bot.send_message(message.chat.id, "Введите новые данные в формате: <Тип Отходов (ID)> <Пункт Приёма (ID)> <Вес> <Дата (YYYY-MM-DD)>\nНапример: 3 2 1.5 2025-04-10")
    bot.register_next_step_handler(message, lambda m: process_edit_report_data(report_id, m))

def process_edit_report_data(report_id, message):
    parts = message.text.strip().split()
    if len(parts) != 4:
        bot.send_message(message.chat.id, "Неверный формат данных. Попробуйте ещё раз.")
        return
    new_type, new_point, new_weight, new_date = parts
    chat_id = message.chat.id
    session = user_sessions.get(chat_id)
    if not session or "user_id" not in session:
        bot.send_message(chat_id, "Сначала войдите в систему.")
        return
    user_id = session["user_id"]
    data = (new_type, new_point, new_weight, new_date, report_id)
    try:
        cursor.execute("""UPDATE waste_reports 
                          SET waste_type_id = ?, collection_point_id = ?, weight = ?, report_date = ?
                          WHERE id = ? AND user_id = ?""", (new_type, new_point, new_weight, new_date, report_id, user_id))
        conn.commit()
        bot.send_message(chat_id, "Отчёт успешно обновлён.")
        show_main_menu(chat_id)
    except Exception as e:
        bot.send_message(chat_id, f"Ошибка при обновлении отчёта: {str(e)}")

# --------- Функция удаления отчёта ---------
def delete_report_by_id(report_id, chat_id):
    session = user_sessions.get(chat_id)
    if not session or "user_id" not in session:
        bot.send_message(chat_id, "Сначала войдите в систему.")
        return
    user_id = session["user_id"]
    try:
        cursor.execute("DELETE FROM waste_reports WHERE id = ? AND user_id = ?", (report_id, user_id))
        conn.commit()
        bot.send_message(chat_id, "Отчёт удалён.")
        show_main_menu(chat_id)
    except Exception as e:
        bot.send_message(chat_id, f"Ошибка при удалении отчёта: {str(e)}")

@bot.message_handler(commands=['delete_report'])
def handle_delete_report(message):
    try:
        report_id = int(message.text.split()[1])
        delete_report_by_id(report_id, message.chat.id)
    except (IndexError, ValueError):
        bot.send_message(message.chat.id, "Используйте команду /delete_report <ID>")

# --------- Функция вывода пунктов приёма ---------
def send_collection_points(message):
    cursor.execute("SELECT id, location, capacity FROM collection_points")
    points = cursor.fetchall()
    if not points:
        bot.send_message(message.chat.id, "Пункты приёма отсутствуют.")
    else:
        reply = "Пункты приёма:\n"
        for point in points:
            pid, location, capacity = point
            reply += f"ID: {pid} | {location} | Вместимость: {capacity}\n"
        bot.send_message(message.chat.id, reply)

# --------- Обработка остальных сообщений ---------
@bot.message_handler(func=lambda message: True)
def default_handler(message):
    bot.send_message(message.chat.id, "Введите /start для начала работы.")

if __name__ == '__main__':
    print("Telegram Bot запущен...")
    bot.polling(none_stop=True, timeout=100)
