import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxesStacked,
  faHouse,
  faCalculator,
  faChartLine,
  faClockRotateLeft,
  faBoxesPacking,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const links = [
    { to: '/', label: 'Accueil', icon: faHouse },
    { to: '/calculateur', label: 'Wilson (regulier)', icon: faCalculator },
    { to: '/irregulier', label: 'Irregulier', icon: faChartLine },
    { to: '/historique', label: 'Historique', icon: faClockRotateLeft },
    { to: '/articles', label: 'Articles', icon: faBoxesPacking },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faBoxesStacked} />
          <span>GFB</span>
        </NavLink>
        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}