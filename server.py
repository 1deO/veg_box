from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from models import db
import os

app = Flask(__name__)

# 資料庫設定（Render PostgreSQL / 本地 SQLite） ---
if "DATABASE_URL" in os.environ:
    # Render 的 postgres:// → 要轉成 postgresql://
    database_url = os.environ["DATABASE_URL"].replace("postgres://", "postgresql://")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    # 本地 SQLite
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 初始化資料庫
db.init_app(app)

# 讓 Render（gunicorn）與本地都會建立資料表
with app.app_context():
    db.create_all()

# --- 路由設定 ---
@app.route("/")
def index():
    return render_template("home.html")

if __name__ == '__main__':
    app.run(debug=True)