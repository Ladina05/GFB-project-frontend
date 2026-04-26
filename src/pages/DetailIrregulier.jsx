import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIrregulierDetail } from '../api/api';
import StockChart from '../components/StockChart';
import ResumeStockTable from '../components/ResumeStockTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlassChart,
  faArrowLeft,
  faTableList,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

export default function DetailIrregulier() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIrregulierDetail(id)
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));

  if (loading) return <div className="container"><div className="loading"><div className="spinner" /></div></div>;
  if (!data) return <div className="container"><div className="alert alert-error">Simulation introuvable</div></div>;

  const consommations = Array.isArray(data.consommations) ? data.consommations : [];
  const simulation = data.simulation_detail;

  return (
    <div className="container">
      <div className="flex-between mb-2">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1><FontAwesomeIcon icon={faMagnifyingGlassChart} /> Detail irrégulière #{data.id}</h1>
          <p>
            {data.article_nom || 'Sans article'} — {new Date(data.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => nav('/historique')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Retour</span>
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><FontAwesomeIcon icon={faTableList} /> Paramètres</div>
          <table>
            <tbody>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Article</td><td>{data.article_nom || 'Sans article'}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Méthode</td><td>{data.methode}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Stock initial</td><td>{fmt(data.stock_initial)} u</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Prix unitaire</td><td>{fmt(data.prix_unitaire)} Ar</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Coût passation</td><td>{fmt(data.cout_passation)} Ar</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Taux possession</td><td>{data.taux_possession} %</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Délai approv.</td><td>{data.delai_approvisionnement} mois</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Marge sécurité</td><td>{data.marge_securite}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#4a5568' }}>Stock sécurité</td><td>{fmt(data.stock_securite)} u</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title"><FontAwesomeIcon icon={faTableList} /> Résultats</div>
          <div className="grid-2">
            <div className="stat-card blue">
              <div className="stat-label">Qe utilisée</div>
              <div className="stat-value">{fmt(data.qe_utilisee)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Nb commandes</div>
              <div className="stat-value">{data.nb_commandes || 0}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Stock moyen</div>
              <div className="stat-value">{fmt(data.stock_moyen)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Ruptures</div>
              <div className="stat-value">{data.nb_ruptures || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><FontAwesomeIcon icon={faTableList} /> Consommations saisies</div>
        {consommations.length === 0 ? (
          <p style={{ color: '#718096' }}>Aucune consommation enregistrée.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Consommation</th>
                </tr>
              </thead>
              <tbody>
                {consommations.map((v, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{fmt(v)} u</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {simulation?.tableau?.length > 0 && (
        <>
          <div className="card">
            <div className="card-title"><FontAwesomeIcon icon={faChartLine} /> Evolution du stock</div>
            <StockChart
              resume={simulation.tableau}
              point_commande={data.wilson_base?.point_commande}
            />
            <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
              Ligne rouge pointillée = SCM ({fmt(data.wilson_base?.point_commande)} u)
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              <FontAwesomeIcon icon={faTableList} /> Tableaux de suivi du stock
            </div>
            <ResumeStockTable
              tableau={simulation.tableau}
              synthese={simulation.synthese}
              methode={simulation.methode}
            />
          </div>
        </>
      )}
    </div>
  );
}
