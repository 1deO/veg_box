from flask import Flask, render_template   # 從 flask模組載入 Flask、render_template
from flask_sqlalchemy import SQLAlchemy
from models import db   # 引入 model.py 裡的 db
import os

# 路由設定
app = Flask(__name__)     # 建立一個 Flask 物件，並命名為app，其中__name__ 表示目前執行的程式

# 資料庫設定（Render PostgreSQL / 本地 SQLite）

if "DATABASE_URL" in os.environ:
    # Render 給的是 postgres://，要轉成 postgresql://。
    database_url = os.environ["DATABASE_URL"].replace("postgres://", "postgresql://")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    # 本地端使用 SQLite
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 初始化資料庫
db.init_app(app)

@app.route("/")           # 使用函式裝飾器，建立一個路由(或稱路徑)，執行時可針對路徑"/"發出請求，作為API負責前端與後端之間的互動

def index():               # 發出請求後會執行index()函式

    return render_template('home.html')   # 會使用樣板引擎回傳(home.html)網頁的內容

if __name__ == '__main__':    # 當執行__name__時，app開始執行

    app.run(debug=True)s