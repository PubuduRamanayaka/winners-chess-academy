import os
import sqlite3
import psycopg2
import smtplib
from email.mime.text import MIMEText
from itsdangerous import URLSafeTimedSerializer
from flask import Flask, render_template, request, redirect, session, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "fallback_local_secret_key")

# Initialize the secure token generator using your Flask secret key
s = URLSafeTimedSerializer(app.secret_key)

# --- Google OAuth Configuration ---
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

def get_database_url():
    database_url = os.environ.get("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    return database_url

def get_db():
    database_url = get_database_url()
    if database_url:
        return psycopg2.connect(database_url)
    else:
        return sqlite3.connect('academy.db')

def init_db():
    database_url = get_database_url()
    conn = get_db()
    cursor = conn.cursor()
    
    if database_url:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password TEXT NOT NULL
            );
        ''')
    else:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password TEXT NOT NULL
            );
        ''')
        
    conn.commit()
    conn.close()

# Automatically initialize tables on startup
try:
    init_db()
except Exception as e:
    print(f"Error during init_db: {e}")


@app.route("/")
@app.route("/index")
def home():
    return render_template("index.html")


# --- Google OAuth Handlers ---
@app.route("/login/google")
def google_login():
    redirect_uri = url_for('google_authorize', _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route("/authorize")
def google_authorize():
    token = google.authorize_access_token()
    resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo')
    user_info = resp.json()
    
    email = user_info.get('email')
    name = user_info.get('name')

    conn = get_db()
    cursor = conn.cursor()
    placeholder = "%s" if get_database_url() else "?"

    cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (email,))
    user = cursor.fetchone()

    # If user doesn't exist, auto-register them
    if not user:
        cursor.execute(
            f'INSERT INTO users (username, email, phone, password) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})',
            (name, email, "", "GOOGLE_AUTH_USER")
        )
        conn.commit()

    conn.close()
    session["user_email"] = email
    return redirect("/dashboard")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        conn = get_db()
        cursor = conn.cursor()
        placeholder = "%s" if get_database_url() else "?"
        cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (email,))
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
    placeholder = "%s" if get_database_url() else "?"
    cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (session["user_email"],))
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
    placeholder = "%s" if get_database_url() else "?"

    if request.method == "POST":
        action = request.form.get("action")

        if action == "change_password":
            current_pass = request.form.get("currentPassword")
            new_pass = request.form.get("newPassword")

            cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (session["user_email"],))
            user = cursor.fetchone()

            if user and check_password_hash(user[4], current_pass):
                new_hashed = generate_password_hash(new_pass)
                cursor.execute(f'UPDATE users SET password = {placeholder} WHERE email = {placeholder}', (new_hashed, session["user_email"]))
                conn.commit()
                conn.close()
                return "Password updated successfully! <a href='/dashboard'>Back to Dashboard</a>"
            else:
                conn.close()
                return "Current password incorrect! <a href='/settings'>Try again</a>"

        elif action == "delete_account":
            cursor.execute(f'DELETE FROM users WHERE email = {placeholder}', (session["user_email"],))
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
    placeholder = "%s" if get_database_url() else "?"

    if request.method == "POST":
        new_name = request.form.get("username")
        new_phone = request.form.get("phone")

        cursor.execute(f'UPDATE users SET username = {placeholder}, phone = {placeholder} WHERE email = {placeholder}', (new_name, new_phone, session["user_email"]))
        conn.commit()

    cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (session["user_email"],))
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
        placeholder = "%s" if get_database_url() else "?"

        cursor.execute(f'SELECT * FROM users WHERE email = {placeholder}', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return "An account with this email already exists! Please hit the back button and try a different email."

        hashed_password = generate_password_hash(password)
        cursor.execute(
            f'INSERT INTO users (username, email, phone, password) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})',
            (username, email, phone, hashed_password)
        )
        conn.commit()
        conn.close()

        return redirect("/login")

    return render_template("register.html")


# --- Password Reset Handlers ---
@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        
        # 1. Generate a secure reset token
        token = s.dumps(email, salt='password-reset-salt')
        
        # 2. Build the full URL for the reset link
        reset_url = url_for('reset_password', token=token, _external=True)
        
        # 3. Configure the email
        sender_email = "winnerschessacademysl@gmail.com"
        app_password = os.environ.get("MAIL_APP_PASSWORD")
        
        msg = MIMEText(f"Click the link below to reset your password:\n\n{reset_url}\n\nIf you did not request this, please ignore this email.")
        msg['Subject'] = 'Password Reset - Winners Chess Academy'
        msg['From'] = sender_email
        msg['To'] = email

        # 4. Connect to Google and send the email
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, email, msg.as_string())
            server.quit()
            
            flash('If an account exists with that email, a reset link has been sent.', 'success')
        except Exception as e:
            flash('Error sending email. Please try again later.', 'error')
            print(f"Mail Error: {e}")
            
        return redirect(url_for('forgot_password'))
        
    return render_template('forgot_password.html')


@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    return f"We successfully generated a token! The token is: {token} <br><br> (We will build the actual reset form next.)"


if __name__ == "__main__":
    app.run(debug=True)