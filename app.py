import os
import psycopg2
import sqlite3
from flask import Flask, render_template, request, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "fallback_local_secret_key")

def get_db():
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url)
    else:
        return sqlite3.connect('academy.db')

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password TEXT NOT NULL
            )
        ''')
    else:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password TEXT NOT NULL
            )
        ''')
        
    conn.commit()
    conn.close()

# Automatically run table check on boot
init_db()


@app.route("/")
@app.route("/index")
def home():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user[4], password):
            session["user_email"] = email
            return redirect("/dashboard")
        else:
            return "Invalid email or password! Please hit the back button and try again."

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    if "user_email" not in session:
        return redirect("/login")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = %s', (session["user_email"],))
    user = cursor.fetchone()
    conn.close()

    return render_template("dashboard.html", current_user=user)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/tournaments")
def tournaments():
    return render_template("tournaments.html")


@app.route("/programs")
def programs():
    return render_template("programs.html")


@app.route("/coaches")
def coaches():
    return render_template("coaches.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/locations")
def locations():
    return render_template("locations.html")


@app.route("/schedule")
def schedule():
    return render_template("schedule.html")


@app.route("/achievements")
def achievements():
    return render_template("achievements.html")


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/settings", methods=["GET", "POST"])
def settings():
    if "user_email" not in session:
        return redirect("/login")

    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        action = request.form.get("action")

        if action == "change_password":
            current_pass = request.form.get("currentPassword")
            new_pass = request.form.get("newPassword")

            cursor.execute('SELECT * FROM users WHERE email = %s', (session["user_email"],))
            user = cursor.fetchone()

            if user and check_password_hash(user[4], current_pass):
                new_hashed = generate_password_hash(new_pass)
                cursor.execute('UPDATE users SET password = %s WHERE email = %s', (new_hashed, session["user_email"]))
                conn.commit()
                conn.close()
                return "Password updated successfully! <a href='/dashboard'>Back to Dashboard</a>"
            else:
                conn.close()
                return "Current password incorrect! <a href='/settings'>Try again</a>"

        elif action == "delete_account":
            cursor.execute('DELETE FROM users WHERE email = %s', (session["user_email"],))
            conn.commit()
            conn.close()
            session.pop("user_email", None)
            return redirect("/")

    conn.close()
    return render_template("settings.html")


@app.route("/logout")
def logout():
    session.pop("user_email", None)
    return redirect("/")


@app.route("/profile", methods=["GET", "POST"])
def profile():
    if "user_email" not in session:
        return redirect("/login")

    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        new_name = request.form.get("username")
        new_phone = request.form.get("phone")

        cursor.execute('UPDATE users SET username = %s, phone = %s WHERE email = %s', (new_name, new_phone, session["user_email"]))
        conn.commit()

    cursor.execute('SELECT * FROM users WHERE email = %s', (session["user_email"],))
    user = cursor.fetchone()
    conn.close()

    return render_template("profile.html", current_user=user)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        phone = request.form.get("phone")
        password = request.form.get("password")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return "An account with this email already exists! Please hit the back button and try a different email."

        hashed_password = generate_password_hash(password)
        cursor.execute('INSERT INTO users (username, email, phone, password) VALUES (%s, %s, %s, %s)',
                       (username, email, phone, hashed_password))
        conn.commit()
        conn.close()

        return redirect("/login")

    return render_template("register.html")


if __name__ == "__main__":
    app.run(debug=True)