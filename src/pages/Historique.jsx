import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistorique, deleteCalcul } from '../api/api';

export default function Historique() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const charger = () => {
    setLoading(true);
    getHistorique()
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce calcul ?')) return;
    await deleteCalcul(id);
    charger();
  };

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));
  const fmtDate = (d) => new Date(d).toLocaleString('fr-FR');

  if (loading) return (
    <div className="container">
      <div className="loading"><div className="spinner" /><p>Chargement...</p></div>
    </div>
  );

  return (
    <div className="container">
      <div className="page-header flex-between">
        <div>
          <h1>📋 Historique des calculs</h1>
          <p>{data.length} calcul(s) sauvegardé(s)</p>
        </div>
        <button className="btn btn-outline" onClick={charger}>🔄 Actualiser</button>
      </div>

      {data.length === 0 ? (
        <div className="card text-center">
          <p style={{ padding: '2rem', color: '#718096' }}>
            Aucun calcul sauvegardé. <br />
            <button className="btn btn-primary mt-2" onClick={() => nav('/calculateur')}>
              🧮 Faire un calcul
            </button>
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Article</th>
                  <th>Consommation</th>
                  <th>N optimal</th>
                  <th>Qe</th>
                  <th>Période</th>
                  <th>Point commande</th>
                  <th>Coût min</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.article_nom || <em style={{ color: '#a0aec0' }}>Sans article</em>}</td>
                    <td>{fmt(c.consommation_annuelle)} u</td>
                    <td><span className="badge badge-info">{Math.round(c.n_optimal)}</span></td>
                    <td>{fmt(c.qe_economique)} u</td>
                    <td>{parseFloat(c.periode_commande).toFixed(2)} mois</td>
                    <td>{fmt(c.point_commande)} u</td>
                    <td>{fmt(c.cout_stockage_min)} Ar</td>
                    <td style={{ fontSize: '0.8rem' }}>{fmtDate(c.created_at)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                          onClick={() => nav(`/detail/${c.id}`)}>
                          👁️
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                          onClick={() => handleDelete(c.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}