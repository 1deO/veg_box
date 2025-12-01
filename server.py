from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Customer, Order, OrderItem, ProduceItem, DeliveryStatus, HarvestRecord, QualityCheck
import os

app = Flask(__name__)
CORS(app)  # React 前端跨域

# 資料庫設定
if "DATABASE_URL" in os.environ:
    # Render 的連線字串需要轉換
    database_url = os.environ["DATABASE_URL"].replace("postgres://", "postgresql://")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    # 本地開發使用 SQLite
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 初始化資料庫
db.init_app(app)
with app.app_context():
    db.create_all()

# HTML 主頁（React 打包後的頁面）
@app.route("/")
def index():
    return render_template("home.html")

# API 區域
# Customer API
@app.route("/api/customers")
def api_customers():
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers])


# Orders API（含客戶＋配送狀態＋訂單明細）
@app.route("/api/orders")
def api_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders])


# 單筆訂單的 OrderItems
@app.route("/api/order_items/<int:order_id>")
def api_order_items(order_id):
    items = OrderItem.query.filter_by(OrderID=order_id).all()
    return jsonify([i.to_dict() for i in items])


# Produce API（蔬果品項）
@app.route("/api/produce")
def api_produce():
    produce = ProduceItem.query.all()
    return jsonify([p.to_dict() for p in produce])


# Harvest Records
@app.route("/api/harvest_records")
def api_harvest_records():
    records = HarvestRecord.query.all()
    return jsonify([r.to_dict() for r in records])


# Quality Check
@app.route("/api/quality_checks")
def api_quality_checks():
    checks = QualityCheck.query.all()
    return jsonify([q.to_dict() for q in checks])


# Delivery Status
@app.route("/api/delivery_status/<int:order_id>")
def api_delivery_status(order_id):
    status = DeliveryStatus.query.filter_by(OrderID=order_id).first()
    return jsonify(status.to_dict() if status else {})


# 執行伺服器
if __name__ == "__main__":
    app.run(debug=True)