
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lang, translations } from '../lang';


interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang }) => {
  const location = useLocation();
  const t = translations[lang];

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
                {t.dashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/expenses" 
                className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
              >
                {t.expenses}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/income" 
                className={`nav-link ${isActive('/income') ? 'active' : ''}`}
              >
                {t.income}
              </Link>
            </li>
          </ul>
          <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setLang('en')} aria-label="English" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: lang === 'en' ? 1 : 0.5 }}>EN</button>
            <button onClick={() => setLang('es')} aria-label="Español" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: lang === 'es' ? 1 : 0.5 }}>ES</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;