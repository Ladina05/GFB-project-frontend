import { useState, useEffect } from 'react';
import {
  simulerQtesConstantes,
  simulerPeriodesConstantes,
  comparerMethodesIrregulier,
  getArticles,
} from '../api/api';
import StockChart from '../components/StockChart';
import ResumeStockTable from '../components/ResumeStockTable';

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

// Données exemple du cours (page 58)
const EXEMPLE_COURS = [200, 150, 250, 250, 200, 200, 150, 50, 200, 250, 250, 250];

const initialParams = {
  article_id: '',
  stock_initial: '350',
  prix_unitaire: '20000',
  cout_passation: '60000',
  taux_possession: '9',
  delai_approvisionnement: '2',
  marge_securite: '1',
  stock_securite: '0',
};

export default function Irregulier() {
  const [consommations, setConsommations] = useState(EXEMPLE_COURS.map(String));
  const [params, setParams] = useState(initialParams);
  const [articles, setArticles] = useState([]);
  const [onglet, setOnglet] = useState('quantites'); // 'quantites' | 'periodes' | 'comparaison'
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sauvegarder, setSauvegarder] = useState(false);

  useEffect(() => {
    getArticles().then((r) => setArticles(r.data.data)).catch(() => {});
  }, []);

  const handleConsoChange = (i, val) => {
    const arr = [...consommations];
    arr[i] = val;
    setConsommations(arr);
  };

  const handleParamChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const totalConso = consommations.reduce((a, b) => a + (parseFloat(b) || 0), 0);

  const valider = () => {
    if (consommations.some((c) => isNaN(parseFloat(c)) || parseFloat(c) < 0)) {
      setError('Toutes les consommations doivent être des nombres positifs');
      return false;
    }
    if (!params.prix_unitaire || !params.cout_passation || !params.taux_possession) {
      setError('Prix unitaire, coût de passation et taux de possession sont requis');
      return false;
    }
    setError('');
    return true;
  };

  const buildPayload = () => ({
    consommations: consommations.map(Number),
    stock_initial: parseFloat(params.stock_initial || 0),
    prix_unitaire: parseFloat(params.prix_unitaire),
    cout_passation: parseFloat(params.cout_passation),
    taux_possession: parseFloat(params.taux_possession),
    delai_approvisionnement: parseFloat(params.delai_approvisionnement || 0),
    marge_securite: parseFloat(params.marge_securite || 1),
    stock_securite: parseFloat(params.stock_securite || 0),
    article_id: params.article_id || null,
    sauvegarder,
  });

  const handleSimuler = async () => {
    if (!valider()) return;
    setLoading(true);
    setResultat(null);
    try {
      let res;
      const payload = buildPayload();
      if (onglet === 'quantites') {
        res = await simulerQtesConstantes(payload);
      } else if (onglet === 'periodes') {
        res = await simulerPeriodesConstantes(payload);
      } else {
        res = await comparerMethodesIrregulier(payload);
      }
      setResultat(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleExemple = () => {
    setConsommations(EXEMPLE_COURS.map(String));
    setParams({
      ...initialParams,
      stock_initial: '350',
      prix_unitaire: '20000',
      cout_passation: '60000',
      taux_possession: '9',
      delai_approvisionnement: '2',
      marge_securite: '1',
    });
    setResultat(null);
    setError('');
  };

  const fmt = (v) => new Intl.NumberFormat('fr-MG').format(Math.round(v || 0));

  return (
    <div className="container">
      <div className="page-header">
        <h1>📊 Consommation Irrégulière</h1>
        <p>Gestion des approvisionnements avec consommations mensuelles variables</p>
      </div>

      {/* ===== ONGLETS ===== */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'quantites', label: '📦 Quantités constantes', desc: 'Lot fixe Qe, dates variables' },
        ].map((o) => (
          <button
            key={o.key}
            className={onglet === o.key ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => { setOnglet(o.key); setResultat(null); }}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* ===== EXPLICATION METHODE ===== */}
      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        {onglet === 'quantites' && (
          <>
            <strong>📦 Méthode des quantités constantes :</strong> On commande toujours la même
            quantité Qe (calculée par Wilson), mais les dates de commande varient selon le niveau
            du stock. On déclenche une commande quand le stock atteint le point de commande (SCM).
          </>
        )}
      </div>

      <div className="grid-2">
        {/* ===== SAISIE CONSOMMATIONS ===== */}
        <div className="card">
          <div className="card-title flex-between">
            <span>📋 Consommations mensuelles</span>
            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
              onClick={handleExemple}>
              📚 Exemple cours
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {MOIS.map((m, i) => (
              <div key={i} className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>
                  {m}
                </label>
                <input
                  className="form-input"
                  type="number"
                  value={consommations[i] || ''}
                  onChange={(e) => handleConsoChange(i, e.target.value)}
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="stat-card blue" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
            <div className="stat-label">Consommation annuelle totale</div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>{fmt(totalConso)}</div>
            <div className="stat-unit">unités/an</div>
          </div>

          {/* Visualisation rapide */}
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.5rem' }}>
              Profil de consommation :
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
              {consommations.map((c, i) => {
                const val = parseFloat(c) || 0;
                const max = Math.max(...consommations.map((x) => parseFloat(x) || 0));
                const h = max > 0 ? (val / max) * 55 : 0;
                return (
                  <div key={i} title={`${MOIS[i]}: ${val}`}
                    style={{
                      flex: 1, height: `${h}px`, background: '#3182ce',
                      borderRadius: '2px 2px 0 0', minHeight: '2px', opacity: 0.8,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {MOIS.map((m, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.62rem', color: '#a0aec0' }}>
                  {m.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== PARAMETRES ===== */}
        <div className="card">
          <div className="card-title">⚙️ Paramètres</div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Article (optionnel)</label>
            <select className="form-select" name="article_id" value={params.article_id}
              onChange={handleParamChange}>
              <option value="">-- Sans article --</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">SI — Stock initial <span>(u)</span></label>
              <input className="form-input" type="number" name="stock_initial"
                value={params.stock_initial} onChange={handleParamChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Pu — Prix unitaire * <span>(Ar)</span></label>
              <input className="form-input" type="number" name="prix_unitaire"
                value={params.prix_unitaire} onChange={handleParamChange} />
            </div>
            <div className="form-group">
              <label className="form-label">f — Coût passation * <span>(Ar)</span></label>
              <input className="form-input" type="number" name="cout_passation"
                value={params.cout_passation} onChange={handleParamChange} />
            </div>
            <div className="form-group">
              <label className="form-label">t — Taux possession * <span>(%)</span></label>
              <input className="form-input" type="number" name="taux_possession"
                value={params.taux_possession} onChange={handleParamChange} />
            </div>
            <div className="form-group">
              <label className="form-label">d — Délai approv. <span>(mois)</span></label>
              <input className="form-input" type="number" name="delai_approvisionnement"
                value={params.delai_approvisionnement} onChange={handleParamChange} step="0.5" />
            </div>
            {onglet === 'quantites' && (
              <div className="form-group">
                <label className="form-label">Marge sécurité <span>(mois)</span></label>
                <input className="form-input" type="number" name="marge_securite"
                  value={params.marge_securite} onChange={handleParamChange} step="0.5" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Ss — Stock sécurité <span>(u)</span></label>
              <input className="form-input" type="number" name="stock_securite"
                value={params.stock_securite} onChange={handleParamChange} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input type="checkbox" id="sauvegarder" checked={sauvegarder}
              onChange={(e) => setSauvegarder(e.target.checked)} />
            <label htmlFor="sauvegarder" style={{ fontSize: '0.88rem', color: '#4a5568', cursor: 'pointer' }}>
              💾 Sauvegarder en base de données
            </label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}
            onClick={handleSimuler} disabled={loading}>
            {loading ? '⏳ Simulation...' : '▶️ Lancer la simulation'}
          </button>
        </div>
      </div>

      {/* ===== RESULTATS ===== */}
      {resultat && onglet !== 'comparaison' && (
        <ResultatSimple resultat={resultat} onglet={onglet} fmt={fmt} />
      )}

      {resultat && onglet === 'comparaison' && (
        <ResultatComparaison resultat={resultat} fmt={fmt} />
      )}
    </div>
  );
}

/* ============================================================
   Composant résultat — une seule méthode
   ============================================================ */
   function ResultatSimple({ resultat, onglet, fmt }) {
    const { wilson_base, simulation, statistiques, consommation_annuelle } = resultat;
  
    return (
      <>
        {/* Statistiques simulation */}
        <div className="card">
          <div className="card-title">
            {onglet === 'quantites'
              ? '📦 Statistiques — Quantités constantes'
              : '📅 Statistiques — Périodes constantes'}
          </div>
          <div className="grid-4">
            <div className="stat-card blue">
              <div className="stat-label">Nb livraisons</div>
              <div className="stat-value">{statistiques.nb_livraisons}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Stock moyen</div>
              <div className="stat-value">{fmt(statistiques.stock_moyen)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Stock min</div>
              <div className="stat-value">{fmt(statistiques.stock_min)}</div>
              <div className="stat-unit">unités</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Ruptures</div>
              <div className="stat-value"
                style={{ color: statistiques.nb_ruptures > 0 ? '#e53e3e' : '#38a169' }}>
                {statistiques.nb_ruptures}
              </div>
            </div>
          </div>
          {statistiques.nb_ruptures > 0 ? (
            <div className="alert alert-error mt-2">
              ⚠️ {statistiques.nb_ruptures} rupture(s) détectée(s).
              Augmentez le stock de sécurité ou la marge de sécurité.
            </div>
          ) : (
            <div className="alert alert-success mt-2">
              ✅ Aucune rupture de stock. Politique satisfaisante.
            </div>
          )}
        </div>
  
        {/* Graphique */}
        <div className="card">
          <div className="card-title">📈 Évolution du stock</div>
          <StockChart
            resume={simulation.tableau}
            point_commande={wilson_base.point_commande}
          />
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Ligne rouge pointillée = SCM ({fmt(wilson_base.point_commande)} u)
          </p>
        </div>
  
        {/* TABLEAU EXACT DU COURS */}
        <div className="card">
          <div className="card-title">
            📋 Tableaux de suivi du stock
          </div>
          <ResumeStockTable
            tableau={simulation.tableau}
            synthese={simulation.synthese}
            methode={simulation.methode}
          />
        </div>
      </>
    );
  }