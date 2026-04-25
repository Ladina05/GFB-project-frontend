import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { calculerRapide, calculerEtSauvegarder, getArticles } from '../api/api';
import SimulationTable from '../components/SimulationTable';
import FormulaCard from '../components/FormulaCard';

const initialForm = {
  article_id: '',
  consommation_annuelle: '',
  prix_unitaire: '',
  cout_passation: '',
  taux_possession: '',
  stock_initial: '',
  delai_approvisionnement: '',
  stock_securite: '',
};

export default function Calculateur() {
  const [form, setForm] = useState(initialForm);
  const [resultat, setResultat] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getArticles()
      .then((r) => setArticles(r.data.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleCalculer = async () => {
    const { consommation_annuelle, prix_unitaire, cout_passation, taux_possession } = form;
    if (!consommation_annuelle || !prix_unitaire || !cout_passation || !taux_possession) {
      setError('⚠️ Veuillez remplir les champs obligatoires (*)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await calculerRapide(form);
      setResultat(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur de calcul');
    } finally {
      setLoading(false);
    }
  };

  const handleSauvegarder = async () => {
    const { consommation_annuelle, prix_unitaire, cout_passation, taux_possession } = form;
    if (!consommation_annuelle || !prix_unitaire || !cout_passation || !taux_possession) {
      setError('Veuillez d\'abord effectuer un calcul');
      return;
    }
    setSaving(true);
    try {
      await calculerEtSauvegarder(form);
      setSuccess('✅ Calcul sauvegardé en base de données !');
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResultat(null);
    setError('');
    setSuccess('');
  };

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));

  // Données graphique
  const chartData = resultat?.simulations?.map((s) => ({
    name: `N=${s.cadence_n}`,
    'Coût Passation': s.cout_passation,
    'Coût Possession': s.cout_possession,
    'Coût Total': s.cout_total,
  })) || [];

  return (
    <div className="container">
      <div className="page-header">
        <h1>🧮 Calculateur Wilson</h1>
        <p>Détermination de la période de commande à quantité constante</p>
      </div>

      <div className="grid-2">
        {/* ===== FORMULAIRE ===== */}
        <div className="card">
          <div className="card-title">📝 Paramètres d'entrée</div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label className="form-label">Article (optionnel)</label>
            <select className="form-select" name="article_id" value={form.article_id} onChange={handleChange}>
              <option value="">-- Sélectionner un article --</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                C — Consommation annuelle * <span>(unités/an)</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="consommation_annuelle"
                value={form.consommation_annuelle}
                onChange={handleChange}
                placeholder="ex: 1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Pu — Prix unitaire * <span>(Ar)</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="prix_unitaire"
                value={form.prix_unitaire}
                onChange={handleChange}
                placeholder="ex: 18000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                f — Coût de passation * <span>(Ar/commande)</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="cout_passation"
                value={form.cout_passation}
                onChange={handleChange}
                placeholder="ex: 70000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                t — Taux de possession * <span>(%)</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="taux_possession"
                value={form.taux_possession}
                onChange={handleChange}
                placeholder="ex: 12"
              />
            </div>

            <div className="form-group">
              <label className="form-label">SI — Stock initial <span>(unités)</span></label>
              <input
                className="form-input"
                type="number"
                name="stock_initial"
                value={form.stock_initial}
                onChange={handleChange}
                placeholder="ex: 350"
              />
            </div>

            <div className="form-group">
              <label className="form-label">d — Délai approvisionnement <span>(mois)</span></label>
              <input
                className="form-input"
                type="number"
                name="delai_approvisionnement"
                value={form.delai_approvisionnement}
                onChange={handleChange}
                placeholder="ex: 1.5"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ss — Stock de sécurité <span>(unités)</span></label>
              <input
                className="form-input"
                type="number"
                name="stock_securite"
                value={form.stock_securite}
                onChange={handleChange}
                placeholder="ex: 50"
              />
            </div>
          </div>

          <div className="flex-end mt-2">
            <button className="btn btn-secondary" onClick={handleReset}>🔄 Réinitialiser</button>
            <button className="btn btn-primary" onClick={handleCalculer} disabled={loading}>
              {loading ? '⏳ Calcul...' : '🧮 Calculer'}
            </button>
          </div>
        </div>
      </div>

      {/* ===== RÉSULTATS ===== */}
      {resultat && (
        <>
          <div className="card">
            <div className="flex-between mb-2">
              <div className="card-title" style={{ marginBottom: 0 }}>
                ✅ Résultats — Modèle de Wilson
              </div>
              <button
                className="btn btn-success"
                onClick={handleSauvegarder}
                disabled={saving}
              >
                {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            </div>

            <div className="grid-4">
              <div className="stat-card blue">
                <div className="stat-label">N optimal</div>
                <div className="stat-value">{resultat.N_arrondi}</div>
                <div className="stat-unit">commandes/an</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Qté économique</div>
                <div className="stat-value">{fmt(resultat.Qe)}</div>
                <div className="stat-unit">unités/commande</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Période</div>
                <div className="stat-value">{resultat.periode_mois}</div>
                <div className="stat-unit">mois entre commandes</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Point de commande</div>
                <div className="stat-value">{fmt(resultat.point_commande)}</div>
                <div className="stat-unit">unités (SCM)</div>
              </div>
            </div>

            <div className="grid-3 mt-2">
              <div className="stat-card blue">
                <div className="stat-label">Coût Passation Total</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {fmt(resultat.cout_passation_total)}
                </div>
                <div className="stat-unit">Ar</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Coût Possession Total</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {fmt(resultat.cout_possession_total)}
                </div>
                <div className="stat-unit">Ar</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-label">Coût Stockage Minimal</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {fmt(resultat.cout_stockage_min)}
                </div>
                <div className="stat-unit">Ar</div>
              </div>
            </div>

            <div className="alert alert-info mt-2">
              <strong>📅 Interprétation :</strong> Commander <strong>{fmt(resultat.Qe)} unités</strong> tous les{' '}
              <strong>{resultat.periode_mois} mois</strong> ({resultat.N_arrondi} commandes/an).
              Déclencher la commande quand le stock atteint{' '}
              <strong>{fmt(resultat.point_commande)} unités</strong>.
              N exact = {resultat.N_optimal}
            </div>
          </div>

          {/* Graphique */}
          <div className="card">
            <div className="card-title">📈 Courbes de coûts</div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => new Intl.NumberFormat('fr').format(v)} />
                  <Tooltip formatter={(v) => new Intl.NumberFormat('fr-MG').format(v) + ' Ar'} />
                  <Legend />
                  <Line type="monotone" dataKey="Coût Passation" stroke="#3182ce" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="Coût Possession" stroke="#38a169" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="Coût Total" stroke="#e53e3e" strokeWidth={2.5} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tableau simulation */}
          <div className="card">
            <div className="card-title">📊 Simulation par cadence</div>
            <SimulationTable simulations={resultat.simulations} />
          </div>
        </>
      )}
    </div>
  );
}