import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="container">
      <div className="hero">
        <h1>📦 Gestion Financière & Budgétaire</h1>
        <p>
          Application de calcul du <strong>Modèle de Wilson</strong> — 
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
          },
          {
            icon: '📊', titre: 'Simulation de cadences',
            desc: 'Comparaison des coûts pour différentes cadences autour de N optimal',
          },
          {
            icon: '🎯', titre: 'Point de commande',
            desc: 'Calcul du stock critique et du stock de sécurité selon le délai d\'approvisionnement',
          },
          {
            icon: '💰', titre: 'Analyse des coûts',
            desc: 'Décomposition des coûts de passation et de possession du stock',
          },
          {
            icon: '📈', titre: 'Graphiques interactifs',
            desc: 'Visualisation des courbes de coûts pour identifier le minimum optimal',
          },
          {
            icon: '🗂️', titre: 'Historique',
            desc: 'Sauvegarde et consultation de tous vos calculs précédents en base de données',
          },
        ].map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.titre}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">📚 Formules du Modèle de Wilson</div>
        <div className="grid-2">
          <div className="formula-box">
            <h4>N optimal (nombre de commandes)</h4>
            <div className="formula">N = √(C × Pu × t / (200 × f))</div>
          </div>
          <div className="formula-box">
            <h4>Quantité économique Qe</h4>
            <div className="formula">Qe = C / N</div>
          </div>
          <div className="formula-box">
            <h4>Période de commande</h4>
            <div className="formula">T = 12 / N (mois)</div>
          </div>
          <div className="formula-box">
            <h4>Point de commande (SCM)</h4>
            <div className="formula">SCM = (C/12) × d + Ss</div>
          </div>
          <div className="formula-box">
            <h4>Coût de stockage total</h4>
            <div className="formula">Cs = f×N + (C×Pu×t)/(200×N)</div>
          </div>
          <div className="formula-box">
            <h4>Légende des variables</h4>
            <p style={{ fontSize: '0.82rem', color: '#4a5568', marginTop: '0.25rem' }}>
              C = Consommation annuelle (unités)<br />
              Pu = Prix unitaire | f = Coût passation<br />
              t = Taux possession (%) | d = Délai approv. (mois)<br />
              Ss = Stock sécurité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}