import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { Lang } from './lang';
import Dashboard from './components/Dashboard';
import ExpensesList from './components/ExpensesList';
import IncomeList from './components/IncomeList';
import './styles/main.scss';

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <Router basename="/Proyecto-uunidad5-santander">
      <div className="app">
        <Navbar lang={lang} setLang={setLang} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard lang={lang} />} />
            <Route path="/expenses" element={<ExpensesList lang={lang} />} />
            <Route path="/income" element={<IncomeList lang={lang} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;