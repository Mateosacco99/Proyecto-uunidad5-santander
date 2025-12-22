from flask import Blueprint, request, jsonify
from models import db, Expense, expense_schema, expenses_schema
from datetime import datetime

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/', methods=['GET'])
def get_expenses():
    """Get all expenses with optional filtering by date range"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Expense.query
    
    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        query = query.filter(Expense.date >= start_date)
    
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        query = query.filter(Expense.date <= end_date)
    
    expenses = query.order_by(Expense.date.desc()).all()
    return jsonify(expenses_schema.dump(expenses))

@expenses_bp.route('/', methods=['POST'])
def create_expense():
    """Create a new expense"""
    try:
        expense_data = request.json
        if 'date' in expense_data and isinstance(expense_data['date'], str):
            expense_data['date'] = datetime.strptime(expense_data['date'], '%Y-%m-%d').date()
        expense = Expense(
            amount=expense_data['amount'],
            description=expense_data['description'],
            date=expense_data.get('date'),
            category_id=expense_data['category_id']
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify(expense_schema.dump(expense)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@expenses_bp.route('/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    """Get a specific expense by ID"""
    expense = Expense.query.get_or_404(expense_id)
    return jsonify(expense_schema.dump(expense))

@expenses_bp.route('/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an existing expense"""
    try:
        expense = Expense.query.get_or_404(expense_id)
        expense_data = request.json
        if 'date' in expense_data and isinstance(expense_data['date'], str):
            expense_data['date'] = datetime.strptime(expense_data['date'], '%Y-%m-%d').date()
        
        for key, value in expense_data.items():
            setattr(expense, key, value)
        
        expense.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(expense_schema.dump(expense))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'}), 200