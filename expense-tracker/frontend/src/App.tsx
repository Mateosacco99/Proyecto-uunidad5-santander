import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpensesList from './components/ExpensesList';
import IncomeList from './components/IncomeList';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <Router basename="/Proyecto-uunidad5-santander">
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/income" element={<IncomeList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;