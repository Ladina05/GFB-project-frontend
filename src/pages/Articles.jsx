import { useState, useEffect } from 'react';
import { getArticles, createArticle, deleteArticle } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxesPacking,
  faCirclePlus,
  faListCheck,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

const emptyForm = { nom: '', description: '', prix_unitaire: '' };

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const charger = () => {
    setLoading(true);
    getArticles()
      .then((r) => setArticles(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async () => {
    if (!form.nom || !form.prix_unitaire) {
      setError('Nom et prix unitaire obligatoires');
      return;
    }
    try {
      await createArticle(form);
      setSuccess('Article ajoute');
      setForm(emptyForm);
      charger();
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    await deleteArticle(id);
    charger();
  };

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(v);

  return (
    <div className="container">
      <div className="page-header">
        <h1><FontAwesomeIcon icon={faBoxesPacking} /> Gestion des articles</h1>
        <p>Gérez vos articles pour les associer aux calculs Wilson</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><FontAwesomeIcon icon={faCirclePlus} /> Ajouter un article</div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input className="form-input" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Matière première X" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description de l'article" />
          </div>
          <div className="form-group">
            <label className="form-label">Prix unitaire * (Ar)</label>
            <input className="form-input" type="number" value={form.prix_unitaire}
              onChange={(e) => setForm({ ...form, prix_unitaire: e.target.value })}
              placeholder="18000" />
          </div>
          <div className="flex-end">
            <button className="btn btn-primary" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faCirclePlus} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Liste des articles ({articles.length})</span>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : articles.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: '2rem' }}>Aucun article</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Prix unitaire</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td><strong>{a.nom}</strong></td>
                      <td className="text-muted">{a.description || '—'}</td>
                      <td>{fmt(a.prix_unitaire)} Ar</td>
                      <td>
                        <button className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          onClick={() => handleDelete(a.id)}>
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}