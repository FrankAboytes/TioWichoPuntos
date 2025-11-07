import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Inicio', icon: '🏠' },
    { path: '/registro', label: '🤠 Registrar Cliente', icon: '🤠' },
    { path: '/buscar', label: '🔍 Buscar Clientes', icon: '🔍' },
  ];

  return (
    <nav className="navbar-vaquero">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="navbar-brand app-title">
            🤠 El TioWicho - Saloon & Restaurant
          </Link>
          
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-vaquero ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;