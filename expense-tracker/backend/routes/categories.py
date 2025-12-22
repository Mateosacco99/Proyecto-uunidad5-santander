from flask import Blueprint, request, jsonify
from models import db, Category, category_schema, categories_schema

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = Category.query.order_by(Category.name).all()
    return jsonify(categories_schema.dump(categories))

@categories_bp.route('/', methods=['POST'])
def create_category():
    """Create a new category"""
    try:
        category_data = request.json
        category = category_schema.load(category_data)
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category_schema.dump(category)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@categories_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update an existing category"""
    try:
        category = Category.query.get_or_404(category_id)
        category_data = request.json
        
        for key, value in category_data.items():
            setattr(category, key, value)
        
        db.session.commit()
        return jsonify(category_schema.dump(category))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get_or_404(category_id)
    if category.expenses or category.income:
        return jsonify({'error': 'Cannot delete category with associated transactions'}), 400
    
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200