#!/usr/bin/env python3
"""
Initialize the database with default categories
Run this script to set up your expense tracker with some default categories
"""

from app import create_app
from models import db, Category

def init_db():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        if Category.query.count() == 0:
            default_categories = [
                {'name': 'Food & Dining', 'color': '#FF6B6B'},
                {'name': 'Transportation', 'color': '#4ECDC4'},
                {'name': 'Shopping', 'color': '#45B7D1'},
                {'name': 'Entertainment', 'color': '#FFA07A'},
                {'name': 'Bills & Utilities', 'color': '#98D8C8'},
                {'name': 'Healthcare', 'color': '#F7DC6F'},
                {'name': 'Education', 'color': '#BB8FCE'},
                {'name': 'Salary', 'color': '#58D68D'},
                {'name': 'Freelance', 'color': '#85C1E9'},
                {'name': 'Investments', 'color': '#F8C471'},
                {'name': 'Other', 'color': '#D5DBDB'},
            ]
            
            for cat_data in default_categories:
                category = Category(**cat_data)
                db.session.add(category)
            
            db.session.commit()
            print("Database initialized with default categories")
        else:
            print("Database already initialized")

if __name__ == '__main__':
    init_db()