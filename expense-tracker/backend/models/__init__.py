from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime
from sqlalchemy import func

db = SQLAlchemy()
ma = Marshmallow()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    color = db.Column(db.String(7), default='#007bff')  # Hex color
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    expenses = db.relationship('Expense', backref='category_ref', lazy=True, cascade='all, delete-orphan')
    income = db.relationship('Income', backref='category_ref', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Category {self.name}>'

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Expense {self.description}: ${self.amount}>'

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Income {self.description}: ${self.amount}>'

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True

class ExpenseSchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema, only=['id', 'name', 'color'], dump_only=True)
    
    class Meta:
        model = Expense
        load_instance = True
        include_fk = True

class IncomeSchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema, only=['id', 'name', 'color'], dump_only=True)
    
    class Meta:
        model = Income
        load_instance = True
        include_fk = True

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
expense_schema = ExpenseSchema()
expenses_schema = ExpenseSchema(many=True)
income_schema = IncomeSchema()
incomes_schema = IncomeSchema(many=True)