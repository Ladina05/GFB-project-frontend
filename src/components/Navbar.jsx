import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          📦 GFB — Modèle de Wilson
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/">🏠 Accueil</NavLink></li>
          <li><NavLink to="/calculateur">🧮 Calculateur</NavLink></li>
          <li><NavLink to="/historique">📋 Historique</NavLink></li>
          <li><NavLink to="/articles">🗂️ Articles</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}