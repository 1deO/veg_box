from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ProduceItem（蔬果品項）
class ProduceItem(db.Model):
    __tablename__ = "ProduceItem"

    ProduceID = db.Column(db.Integer, primary_key=True)
    ProduceName = db.Column(db.String(50), unique=True, nullable=False)

    type = db.Column(db.String(20))
    season = db.Column(db.ARRAY(db.Integer))
    shelfLife = db.Column("shelflife", db.Integer)
    growthDays = db.Column("growthdays", db.Integer)
    unit = db.Column(db.String(20))

    price = db.Column(db.Float)   # 售價 p
    cost = db.Column(db.Float)    # 成本 c
    residualValue = db.Column("residualvalue",db.Float)  # 殘值 v
    serviceLevel = db.Column("servicelevel", db.Float) # 服務水準

    @property
    def service_level(self):
        Cs = self.price - self.cost
        Ce = self.cost - self.residualvalue

        if Cs + Ce == 0:
            return None  # 避免除零

        SL = Cs / (Cs + Ce)
        return round(SL, 3)  # 例如 0.732
    
    @property
    def quality_threshold(self):
        if self.service_level is None:
            return 0.7  # 預設

        if self.service_level >= 0.7:
            return 0.5   # 高價值 → 放到 50% 就算不佳
        elif self.service_level >= 0.5:
            return 0.7
        else:
            return 0.85  # 低價值 → 可放更久

    harvest_records = db.relationship(
        "HarvestRecord",
        back_populates="produce",
        lazy="select"
    )

    def to_dict(self):
        return {
            "ProduceID": self.ProduceID,
            "ProduceName": self.ProduceName,
            "type": self.type,
            "season": self.season,
            "shelfLife": self.shelfLife,
            "growthDays": self.growthDays,
            "unit": self.unit,
            "unit": self.unit,
            "price": self.price,
            "cost": self.cost,
            "residualValue": self.residualValue,
            "serviceLevel": self.serviceLevel,
        }


# HarvestRecord（採收紀錄）
class HarvestRecord(db.Model):
    __tablename__ = "HarvestRecord"

    HarvestID = db.Column(db.Integer, primary_key=True)
    ProduceID = db.Column(db.Integer, db.ForeignKey("ProduceItem.ProduceID"), nullable=False)

    gradeA = db.Column("gradea", db.Integer)
    gradeB = db.Column("gradeb", db.Integer)
    gradeC = db.Column("gradec", db.Integer)
    HarvestDate = db.Column("harvestdate", db.Date)
    daysStored = db.Column("daysstored", db.Integer)

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
    
    def to_dict(self):
        return {
            "HarvestID": self.HarvestID,
            "ProduceID": self.ProduceID,
            "gradeA": self.gradeA,
            "gradeB": self.gradeB,
            "gradeC": self.gradeC,
            "HarvestDate": self.HarvestDate.isoformat() if self.HarvestDate else None,
            "daysStored": self.daysStored,
            "Produce": self.produce.to_dict(),  # 這裡已經有 serviceLevel
    }

# QualityCheck（品質檢查）
class QualityCheck(db.Model):
    __tablename__ = "QualityCheck"

    QualityID = db.Column(db.Integer, primary_key=True)
    HarvestID = db.Column(db.Integer, db.ForeignKey("HarvestRecord.HarvestID"), nullable=False)
    Grade = db.Column(db.String(5), nullable=False)
    Note = db.Column(db.String(200))

    harvest_record = db.relationship(
        "HarvestRecord",
        back_populates="quality_checks",
        lazy="joined"
    )

    def to_dict(self):
        return {
            "QualityID": self.QualityID,
            "HarvestID": self.HarvestID,
            "Grade": self.Grade,
            "Note": self.Note,
        }

# Customer（顧客）
class Customer(db.Model):
    __tablename__ = "Customer"

    CustomerID = db.Column(db.Integer, primary_key=True)
    CustomerName = db.Column(db.String(50), nullable=False)
    Gender = db.Column(db.String(1))
    Age = db.Column(db.Integer)
    TotalSpent = db.Column(db.Float, default=0)
    LastPurchaseDate = db.Column(db.String(20))
    PurchaseCount = db.Column(db.Integer, default=0)

    orders = db.relationship("Order", back_populates="customer", lazy="select")

    def to_dict(self):
        return {
            "CustomerID": self.CustomerID,
            "CustomerName": self.CustomerName,
            "Gender": self.Gender,
            "Age": self.Age,
            "TotalSpent": self.TotalSpent,
            "LastPurchaseDate": self.LastPurchaseDate,
            "PurchaseCount": self.PurchaseCount,
        }


# Order（訂單）
class Order(db.Model):
    __tablename__ = "Order"

    OrderID = db.Column(db.Integer, primary_key=True)
    CustomerID = db.Column(db.Integer, db.ForeignKey("Customer.CustomerID"), nullable=False)

    OrderDate = db.Column(db.String(20), nullable=False)
    TotalAmount = db.Column(db.Float, nullable=False)
    TotalPrice = db.Column(db.Float, nullable=False)
    BoxPrice = db.Column(db.Integer)

    customer = db.relationship("Customer", back_populates="orders", lazy="joined")
    order_items = db.relationship("OrderItem", back_populates="order", lazy="select")
    delivery_status = db.relationship("DeliveryStatus", back_populates="order", lazy="select", uselist=False)

    def to_dict(self):
        return {
            "OrderID": self.OrderID,
            "CustomerID": self.CustomerID,
            "OrderDate": self.OrderDate,
            "TotalAmount": self.TotalAmount,
            "TotalPrice": self.TotalPrice,
            "BoxPrice": self.BoxPrice,
            "Customer": self.customer.to_dict(),
            "DeliveryStatus": self.delivery_status.to_dict() if self.delivery_status else None,
            "OrderItems": [item.to_dict() for item in self.order_items],
        }


# OrderItem（訂單明細）
class OrderItem(db.Model):
    __tablename__ = "OrderItem"

    OrderID = db.Column(db.Integer, db.ForeignKey("Order.OrderID"), primary_key=True)
    ProduceID = db.Column(db.Integer, db.ForeignKey("ProduceItem.ProduceID"), primary_key=True)

    Quantity = db.Column(db.Float, nullable=False)
    Price = db.Column(db.Float, nullable=False)

    order = db.relationship("Order", back_populates="order_items", lazy="joined")
    produce = db.relationship("ProduceItem", lazy="joined")

    def to_dict(self):
        return {
            "OrderID": self.OrderID,
            "ProduceID": self.ProduceID,
            "Quantity": self.Quantity,
            "Price": self.Price,
            "Produce": self.produce.to_dict(),
        }


# DeliveryStatus（配送狀態）
class DeliveryStatus(db.Model):
    __tablename__ = "DeliveryStatus"

    StatusID = db.Column(db.Integer, primary_key=True)
    OrderID = db.Column(db.Integer, db.ForeignKey("Order.OrderID"), nullable=False, unique=True)

    Status = db.Column(db.String(20), nullable=False)
    UpdateTime = db.Column(db.String(20))

    order = db.relationship("Order", back_populates="delivery_status", lazy="joined")

    def to_dict(self):
        return {
            "StatusID": self.StatusID,
            "OrderID": self.OrderID,
            "Status": self.Status,
            "UpdateTime": self.UpdateTime,
        }