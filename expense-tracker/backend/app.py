from flask import Flask
from flask_cors import CORS
from config import config

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    from models import db, ma
    db.init_app(app)
    ma.init_app(app)
    CORS(app)
    
    # Register blueprints
    from routes.expenses import expenses_bp
    from routes.income import income_bp
    from routes.categories import categories_bp
    from routes.dashboard import dashboard_bp
    
    app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
    app.register_blueprint(income_bp, url_prefix='/api/income')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)