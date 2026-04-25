import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          📦 GFB
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/">🏠 Accueil</NavLink></li>
          <li><NavLink to="/calculateur">🧮 Wilson (régulier)</NavLink></li>
          <li><NavLink to="/irregulier">📊 Irrégulier</NavLink></li>
          <li><NavLink to="/historique">📋 Historique</NavLink></li>
          <li><NavLink to="/articles">🗂️ Articles</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}