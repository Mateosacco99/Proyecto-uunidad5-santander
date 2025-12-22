import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            💰 Expense Tracker
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/expenses" 
                className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
              >
                Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/income" 
                className={`nav-link ${isActive('/income') ? 'active' : ''}`}
              >
                Income
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;