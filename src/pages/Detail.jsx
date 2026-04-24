import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCalculDetail } from '../api/api';
import SimulationTable from '../components/SimulationTable';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function Detail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalculDetail(id)
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));

  if (loading) return <div className="container"><div className="loading"><div className="spinner" /></div></div>;
  if (!data) return <div className="container"><div className="alert alert-error">Calcul introuvable</div></div>;

  const chartData = data.simulations?.map((s) => ({
    name: `N=${s.cadence_n}`,
    'Coût Passation': parseFloat(s.cout_passation),
    'Coût Possession': parseFloat(s.cout_possession),
    'Coût Total': parseFloat(s.cout_total),
  })) || [];

  const sims = data.simulations?.map((s) => ({
    ...s,
    est_optimal: parseInt(s.cadence_n) === Math.round(parseFloat(data.n_optimal)),
    quantite_par_commande: parseFloat(data.consommation_annuelle) / parseInt(s.cadence_n),
    periode_mois: (12 / parseInt(s.cadence_n)).toFixed(2),
  }));

  return (
    <div className="container">
      <div className="flex-between mb-2">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>🔍 Détail calcul #{data.id}</h1>
          <p>
            {data.article_nom || 'Sans article'} —{' '}
            {new Date(data.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => nav('/historique')}>
          ← Retour
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">📥 Données d'entrée</div>
          <table>
            <tbody>
              {[
                ['C — Consommation annuelle', `${fmt(data.consommation_annuelle)} unités`],
                ['Pu — Prix unitaire', `${fmt(data.prix_unitaire)} Ar`],
                ['f — Coût de passation', `${fmt(data.cout_passation)} Ar`],
                ['t — Taux de possession', `${data.taux_possession} %`],
                ['SI — Stock initial', `${fmt(data.stock_initial)} unités`],
                ['d — Délai approv.', `${data.delai_approvisionnement} mois`],
                ['Ss — Stock sécurité', `${fmt(data.stock_securite)} unités`],
              ].map(([l, v]) => (
                <tr key={l}>
                  <td style={{ fontWeight: 600, color: '#4a5568' }}>{l}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">📊 Résultats</div>
          <div className="grid-2">
            <div className="stat-card blue">
              <div className="stat-label">N optimal</div>
              <div className="stat-value">{Math.round(data.n_optimal)}</div>
              <div className="stat-unit">commandes/an</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Qté économique</div>
              <div className="stat-value">{fmt(data.qe_economique)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Période</div>
              <div className="stat-value">{parseFloat(data.periode_commande).toFixed(2)}</div>
              <div className="stat-unit">mois</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Point de commande</div>
              <div className="stat-value">{fmt(data.point_commande)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Coût passation</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{fmt(data.cout_passation_total)}</div>
              <div className="stat-unit">Ar</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Coût stockage min</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{fmt(data.cout_stockage_min)}</div>
              <div className="stat-unit">Ar</div>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <div className="card-title">📈 Courbes de coûts</div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => new Intl.NumberFormat('fr').format(v)} />
                <Tooltip formatter={(v) => fmt(v) + ' Ar'} />
                <Legend />
                <Line type="monotone" dataKey="Coût Passation" stroke="#3182ce" strokeWidth={2} dot />
                <Line type="monotone" dataKey="Coût Possession" stroke="#38a169" strokeWidth={2} dot />
                <Line type="monotone" dataKey="Coût Total" stroke="#e53e3e" strokeWidth={2.5} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {sims?.length > 0 && (
        <div className="card">
          <div className="card-title">📋 Tableau de simulation</div>
          <SimulationTable simulations={sims} />
        </div>
      )}
    </div>
  );
}