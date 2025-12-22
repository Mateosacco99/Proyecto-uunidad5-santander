from flask import Blueprint, request, jsonify
from models import db, Income, income_schema, incomes_schema
from datetime import datetime

income_bp = Blueprint('income', __name__)

@income_bp.route('/', methods=['GET'])
def get_income():
    """Get all income with optional filtering by date range"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Income.query
    
    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        query = query.filter(Income.date >= start_date)
    
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        query = query.filter(Income.date <= end_date)
    
    income = query.order_by(Income.date.desc()).all()
    return jsonify(incomes_schema.dump(income))

@income_bp.route('/', methods=['POST'])
def create_income():
    """Create a new income entry"""
    try:
        income_data = request.json
        if 'date' in income_data and isinstance(income_data['date'], str):
            income_data['date'] = datetime.strptime(income_data['date'], '%Y-%m-%d').date()
        
        income = Income(
            amount=income_data['amount'],
            description=income_data['description'],
            date=income_data.get('date'),
            category_id=income_data['category_id']
        )
        
        db.session.add(income)
        db.session.commit()
        
        return jsonify(income_schema.dump(income)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@income_bp.route('/<int:income_id>', methods=['GET'])
def get_income_by_id(income_id):
    """Get a specific income entry by ID"""
    income = Income.query.get_or_404(income_id)
    return jsonify(income_schema.dump(income))

@income_bp.route('/<int:income_id>', methods=['PUT'])
def update_income(income_id):
    """Update an existing income entry"""
    try:
        income = Income.query.get_or_404(income_id)
        income_data = request.json
        if 'date' in income_data and isinstance(income_data['date'], str):
            income_data['date'] = datetime.strptime(income_data['date'], '%Y-%m-%d').date()
        
        for key, value in income_data.items():
            setattr(income, key, value)
        
        income.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(income_schema.dump(income))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@income_bp.route('/<int:income_id>', methods=['DELETE'])
def delete_income(income_id):
    """Delete an income entry"""
    income = Income.query.get_or_404(income_id)
    db.session.delete(income)
    db.session.commit()
    return jsonify({'message': 'Income deleted successfully'}), 200