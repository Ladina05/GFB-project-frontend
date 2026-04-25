import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="container">
      <div className="hero">
        <h1>Gestion Financière & Budgétaire</h1>
        <p>
          Détermination de la période de commande à quantité constante
        </p>
        <div className="hero-actions">
          <button className="btn btn-success" onClick={() => nav('/calculateur')}>
            🧮 Lancer un calcul
          </button>
          <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}
            onClick={() => nav('/historique')}>
            📋 Voir l'historique
          </button>
        </div>
      </div>

      <div className="grid-3">
        {[
          {
            icon: '📐', titre: 'Modèle de Wilson',
            desc: 'Calcul du nombre optimal de commandes N et de la quantité économique Qe',
            lien: '/calculateur',
          },
          {
            icon: '📊', titre: 'Consommation irrégulière',
            desc: 'Simulation avec quantités constantes ou périodes constantes selon le cours GFB',
            lien: '/irregulier',
          },
          {
            icon: '💾', titre: 'Historique',
            desc: 'Sauvegarde en PostgreSQL de tous vos calculs et simulations',
            lien: '/historique',
          },
          {
            icon: '🗂️', titre: 'Articles',
            desc: 'Gérez vos articles et associez-les aux calculs',
            lien: '/articles',
          },
        ].map((f, i) => (
          <div key={i} className="feature-card" onClick={() => nav(f.lien)}
            style={{ cursor: 'pointer' }}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.titre}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}