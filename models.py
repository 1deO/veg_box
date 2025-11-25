from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ProduceItem（蔬果品項）
class ProduceItem(db.Model):
    __tablename__ = "ProduceItem"

    ProduceID = db.Column(db.Integer, primary_key=True)
    ProduceName = db.Column(db.String(50), nullable=False)
    Unit = db.Column(db.String(20), nullable=False)

    harvest_records = db.relationship(
        "HarvestRecord",
        back_populates="produce",
        lazy="select"
    )

    def __repr__(self):
        return f"<ProduceItem {self.ProduceID} - {self.ProduceName}>"


# HarvestRecord（採收紀錄）
class HarvestRecord(db.Model):
    __tablename__ = "HarvestRecord"

    HarvestID = db.Column(db.Integer, primary_key=True)
    ProduceID = db.Column(db.Integer, db.ForeignKey("ProduceItem.ProduceID"), nullable=False)
    HarvestDate = db.Column(db.String(20), nullable=False)
    HarvestQty = db.Column(db.Float, nullable=False)
    HarvestWeight = db.Column(db.Float, nullable=False)

    produce = db.relationship(
        "ProduceItem",
        back_populates="harvest_records",
        lazy="joined"
    )
    quality_checks = db.relationship(
        "QualityCheck",
        back_populates="harvest_record",
        lazy="select"
    )

    def __repr__(self):
        return f"<HarvestRecord {self.HarvestID} (Produce {self.ProduceID})>"


# QualityCheck（品質檢查）
class QualityCheck(db.Model):
    __tablename__ = "QualityCheck"

    QualityID = db.Column(db.Integer, primary_key=True)
    HarvestID = db.Column(db.Integer, db.ForeignKey("HarvestRecord.HarvestID"), nullable=False)
    Grade = db.Column(db.String(5), nullable=False)   # A / B / C
    Note = db.Column(db.String(200))

    harvest_record = db.relationship(
        "HarvestRecord",
        back_populates="quality_checks",
        lazy="joined"
    )

    def __repr__(self):
        return f"<QualityCheck {self.QualityID} - Grade {self.Grade}>"

# Customer（顧客）
class Customer(db.Model):
    __tablename__ = "Customer"

    CustomerID = db.Column(db.Integer, primary_key=True)
    CustomerName = db.Column(db.String(50), nullable=False)
    Gender = db.Column(db.String(1))           # M / F
    Age = db.Column(db.Integer)
    TotalSpent = db.Column(db.Float, default=0)
    LastPurchaseDate = db.Column(db.String(20))
    PurchaseCount = db.Column(db.Integer, default=0)

    orders = db.relationship("Order", back_populates="customer", lazy="select")

    def __repr__(self):
        return f"<Customer {self.CustomerID} - {self.CustomerName}>"


# Order（訂單）
class Order(db.Model):
    __tablename__ = "Order"

    OrderID = db.Column(db.Integer, primary_key=True)
    CustomerID = db.Column(db.Integer, db.ForeignKey("Customer.CustomerID"), nullable=False)
    OrderDate = db.Column(db.String(20), nullable=False)
    TotalAmount = db.Column(db.Float, nullable=False)
    TotalPrice = db.Column(db.Float, nullable=False)

    customer = db.relationship(
        "Customer",
        back_populates="orders",
        lazy="joined"
    )
    order_items = db.relationship(
        "OrderItem",
        back_populates="order",
        lazy="select"
    )
    delivery_status = db.relationship(
        "DeliveryStatus",
        back_populates="order",
        lazy="select",
        uselist=False
    )

    def __repr__(self):
        return f"<Order {self.OrderID} - Customer {self.CustomerID}>"



# OrderItem（訂單蔬果明細）
class OrderItem(db.Model):
    __tablename__ = "OrderItem"

    OrderID = db.Column(db.Integer, db.ForeignKey("Order.OrderID"), primary_key=True)
    ProduceID = db.Column(db.Integer, db.ForeignKey("ProduceItem.ProduceID"), primary_key=True)

    Quantity = db.Column(db.Float, nullable=False)
    Price = db.Column(db.Float, nullable=False)

    order = db.relationship("Order", back_populates="order_items", lazy="joined")
    produce = db.relationship("ProduceItem", lazy="joined")

    def __repr__(self):
        return f"<OrderItem Order={self.OrderID}, Produce={self.ProduceID}, Qty={self.Quantity}>"



# DeliveryStatus（配送狀態）
class DeliveryStatus(db.Model):
    __tablename__ = "DeliveryStatus"

    StatusID = db.Column(db.Integer, primary_key=True)
    OrderID = db.Column(db.Integer, db.ForeignKey("Order.OrderID"), nullable=False, unique=True)

    Status = db.Column(db.String(20), nullable=False)
    UpdateTime = db.Column(db.String(20))

    order = db.relationship("Order", back_populates="delivery_status", lazy="joined")

    def __repr__(self):
        return f"<DeliveryStatus {self.StatusID} - Order {self.OrderID} ({self.Status})>"
