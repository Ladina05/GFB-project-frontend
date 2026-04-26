import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getHistorique,
  getHistoriqueIrregulier,
  deleteCalcul,
  deleteIrregulier,
} from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClockRotateLeft,
  faRotateRight,
  faCalculator,
  faEye,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

export default function Historique() {
  const [dataWilson, setDataWilson] = useState([]);
  const [dataIrregulier, setDataIrregulier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreType, setFiltreType] = useState('wilson');
  const nav = useNavigate();

  const charger = async () => {
    setLoading(true);
    try {
      const [wilsonRes, irregulierRes] = await Promise.all([
        getHistorique(),
        getHistoriqueIrregulier(),
      ]);

      setDataWilson(wilsonRes.data.data || []);
      setDataIrregulier(irregulierRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce calcul ?')) return;
    await deleteCalcul(id);
    charger();
  };

  const handleDeleteIrregulier = async (id) => {
    if (!window.confirm('Supprimer cette simulation irrégulière ?')) return;
    await deleteIrregulier(id);
    charger();
  };

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));
  const fmtDate = (d) => new Date(d).toLocaleString('fr-FR');
  const dataFiltre = filtreType === 'wilson' ? dataWilson : dataIrregulier;

  if (loading) return (
    <div className="container">
      <div className="loading"><div className="spinner" /><p>Chargement...</p></div>
    </div>
  );

  return (
    <div className="container">
      <div className="page-header flex-between">
        <div>
          <h1><FontAwesomeIcon icon={faClockRotateLeft} /> Historique des calculs</h1>
          <p>{dataFiltre.length} calcul(s) sauvegardé(s)</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            className="form-select"
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            style={{ minWidth: '170px' }}
          >
            <option value="wilson">Wilson</option>
            <option value="irregulier">Irrégulière</option>
          </select>
          <button className="btn btn-outline" onClick={charger}>
            <FontAwesomeIcon icon={faRotateRight} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {dataFiltre.length === 0 ? (
        <div className="card text-center">
          <p style={{ padding: '2rem', color: '#718096' }}>
            Aucun calcul sauvegardé. <br />
            <button className="btn btn-primary mt-2" onClick={() => nav('/calculateur')}>
              <FontAwesomeIcon icon={faCalculator} />
              <span>Faire un calcul</span>
            </button>
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            {filtreType === 'wilson' ? (
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
                  {dataWilson.map((c) => (
                    <tr key={`wilson-${c.id}`}>
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
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                            onClick={() => handleDelete(c.id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Article</th>
                    <th>Méthode</th>
                    <th>Qe utilisée</th>
                    <th>Nb commandes</th>
                    <th>Stock moyen</th>
                    <th>Ruptures</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataIrregulier.map((c) => (
                    <tr key={`irregulier-${c.id}`}>
                      <td>{c.id}</td>
                      <td>{c.article_nom || <em style={{ color: '#a0aec0' }}>Sans article</em>}</td>
                      <td>{c.methode === 'quantites_constantes' ? 'Quantités constantes' : c.methode}</td>
                      <td>{fmt(c.qe_utilisee)} u</td>
                      <td><span className="badge badge-success">{c.nb_commandes || 0}</span></td>
                      <td>{fmt(c.stock_moyen)} u</td>
                      <td>
                        <span className={`badge ${Number(c.nb_ruptures || 0) > 0 ? 'badge-danger' : 'badge-success'}`}>
                          {c.nb_ruptures || 0}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{fmtDate(c.created_at)}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                            onClick={() => nav(`/detail-irregulier/${c.id}`)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteIrregulier(c.id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}