import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faClockRotateLeft,
  faDraftingCompass,
  faChartLine,
  faFloppyDisk,
  faBoxesPacking,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const nav = useNavigate();
  const features = [
    {
      icon: faDraftingCompass,
      titre: 'Modele de Wilson',
      desc: 'Calcul du nombre optimal de commandes N et de la quantite economique Qe',
      lien: '/calculateur',
    },
    {
      icon: faChartLine,
      titre: 'Consommation irreguliere',
      desc: 'Simulation avec quantites constantes ou periodes constantes selon le cours GFB',
      lien: '/irregulier',
    },
    {
      icon: faBoxesPacking,
      titre: 'Articles',
      desc: 'Gerez vos articles et associez-les aux calculs',
      lien: '/articles',
    },
    {
      icon: faFloppyDisk,
      titre: 'Historique',
      desc: 'Sauvegarde en PostgreSQL de tous vos calculs et simulations',
      lien: '/historique',
    },
  ];

  return (
    <div className="container">
      <div className="hero">
        <h1>Gestion Financière & Budgétaire</h1>
        <p>
          Détermination de la période de commande à quantité constante
        </p>
        <div className="hero-actions">
          <button className="btn btn-success" onClick={() => nav('/calculateur')}>
            <FontAwesomeIcon icon={faCalculator} />
            <span>Lancer un calcul</span>
          </button>
          <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}
            onClick={() => nav('/historique')}>
            <FontAwesomeIcon icon={faClockRotateLeft} />
            <span>Voir l'historique</span>
          </button>
        </div>
      </div>

      <div className="feature-grid-centered">
        {features.map((f, i) => (
          <div key={i} className="feature-card" onClick={() => nav(f.lien)}
            style={{ cursor: 'pointer' }}>
            <div className="feature-icon"><FontAwesomeIcon icon={f.icon} /></div>
            <h3>{f.titre}</h3>
            <p>{f.desc}</p>
            <span className="feature-link">
              Decouvrir
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}