from flask import Blueprint, request, jsonify
from models import db, Expense, Income, Category
from sqlalchemy import func, extract
from datetime import datetime, date
import calendar

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get summary of expenses and income for a given month/year"""
    year = request.args.get('year', datetime.now().year, type=int)
    month = request.args.get('month', datetime.now().month, type=int)
    
    total_expenses = db.session.query(func.sum(Expense.amount)).filter(
        extract('year', Expense.date) == year,
        extract('month', Expense.date) == month
    ).scalar() or 0
    
    total_income = db.session.query(func.sum(Income.amount)).filter(
        extract('year', Income.date) == year,
        extract('month', Income.date) == month
    ).scalar() or 0
    
    balance = total_income - total_expenses
    
    expenses_by_category = db.session.query(
        Category.name,
        Category.color,
        func.sum(Expense.amount).label('total')
    ).join(Expense).filter(
        extract('year', Expense.date) == year,
        extract('month', Expense.date) == month
    ).group_by(Category.id).all()
    
    income_by_category = db.session.query(
        Category.name,
        Category.color,
        func.sum(Income.amount).label('total')
    ).join(Income).filter(
        extract('year', Income.date) == year,
        extract('month', Income.date) == month
    ).group_by(Category.id).all()
    
    return jsonify({
        'month': calendar.month_name[month],
        'year': year,
        'total_expenses': total_expenses,
        'total_income': total_income,
        'balance': balance,
        'expenses_by_category': [
            {'name': name, 'color': color, 'amount': float(total)}
            for name, color, total in expenses_by_category
        ],
        'income_by_category': [
            {'name': name, 'color': color, 'amount': float(total)}
            for name, color, total in income_by_category
        ]
    })

@dashboard_bp.route('/monthly-trend', methods=['GET'])
def get_monthly_trend():
    """Get monthly expense and income trend for the last 12 months"""
    monthly_expenses = db.session.query(
        extract('year', Expense.date).label('year'),
        extract('month', Expense.date).label('month'),
        func.sum(Expense.amount).label('total')
    ).group_by(
        extract('year', Expense.date),
        extract('month', Expense.date)
    ).order_by(
        extract('year', Expense.date).desc(),
        extract('month', Expense.date).desc()
    ).limit(12).all()
    
    monthly_income = db.session.query(
        extract('year', Income.date).label('year'),
        extract('month', Income.date).label('month'),
        func.sum(Income.amount).label('total')
    ).group_by(
        extract('year', Income.date),
        extract('month', Income.date)
    ).order_by(
        extract('year', Income.date).desc(),
        extract('month', Income.date).desc()
    ).limit(12).all()
    
    expense_data = [
        {
            'month': calendar.month_name[int(month)],
            'year': int(year),
            'amount': float(total)
        }
        for year, month, total in reversed(monthly_expenses)
    ]
    
    income_data = [
        {
            'month': calendar.month_name[int(month)],
            'year': int(year),
            'amount': float(total)
        }
        for year, month, total in reversed(monthly_income)
    ]
    
    return jsonify({
        'expenses': expense_data,
        'income': income_data
    })