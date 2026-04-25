/**
 * Reproduit EXACTEMENT les tableaux du cours GFB pages 58-60
 *
 * TABLEAU DÉTAILLÉ (format cours §5.1 et §5.2) :
 * ┌──────────┬──────────────┬────────────────────────────┬───────────┬──────────────────────────────────┬──────────────────┐
 * │ Périodes │ Consomm.     │ Stock avec rupture évent.  │ Livraisons│ Stock rectifié en fonct. entrées │ Commandes        │
 * │          │              │                            │           │                                  │ Date │ Quantité  │
 * ├──────────┼──────────────┼────────────────────────────┼───────────┼──────────────────────────────────┼──────┼───────────┤
 * │ D        │              │            350             │           │              350                 │      │           │
 * │ J        │     200      │            150             │           │              150                 │début D│   400    │
 * │ F        │     150      │              0 (1)         │    400    │              400                 │      │           │
 * ...
 *
 * TABLEAU SYNTHÈSE (format cours page 59) :
 * ┌───────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬────┬─────┬─────┬─────┬─────┬─────┐
 * │           │  D  │  J  │  F  │  M  │  A  │  M  │  J  │ Ju │  A  │  S  │  O  │  N  │  D  │
 * ├───────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼─────┼─────┼─────┼─────┼─────┤
 * │ Commandes │ 400 │ 400 │     │ 400 │     │     │ 400 │    │ 400 │ 400 │     │     │     │
 * │ Livraisons│     │     │ 400 │ 400 │     │ 400 │     │    │ 400 │     │ 400 │ 400 │     │
 * │ Sorties   │     │ 200 │ 150 │ 250 │ 250 │ 200 │ 200 │150 │  50 │ 200 │ 250 │ 250 │ 250 │
 * │ Stock     │ 350 │ 150 │ 400 │ 550 │ 300 │ 500 │ 300 │150 │ 500 │ 300 │ 450 │ 600 │ 350 │
 * └───────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴─────┴─────┴─────┴─────┴─────┘
 */

export default function ResumeStockTable({ tableau, synthese, methode }) {
  if (!tableau || tableau.length === 0) return null;

  const fmt = (v) =>
    v !== null && v !== undefined && !isNaN(v)
      ? new Intl.NumberFormat('fr-FR').format(Math.round(v))
      : '';

  const titre =
    methode === 'quantites_constantes'
      ? '§ 5.1 — Commandes de quantités constantes'
      : '§ 5.2 — Commandes par périodes constantes';

  /* ── styles inline pour coller au cours ── */
  const thBase = {
    padding: '8px 10px',
    border: '1px solid #718096',
    textAlign: 'center',
    fontSize: '0.82rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    color: 'white',
  };
  const tdBase = {
    padding: '7px 10px',
    border: '1px solid #cbd5e0',
    textAlign: 'center',
    fontSize: '0.85rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* ══════════════════════════════════════════════════════════════
          TABLEAU DÉTAILLÉ — Format exact cours pages 58-59
          ══════════════════════════════════════════════════════════════ */}
      <div>
        <div style={{
          background: '#1a365d', color: 'white', padding: '8px 14px',
          borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: '0.9rem',
        }}>
          {titre}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            borderCollapse: 'collapse', width: '100%',
            border: '2px solid #1a365d',
          }}>
            <thead>
              {/* Ligne 1 — entêtes principales */}
              <tr>
                <th rowSpan={2} style={{ ...thBase, background: '#1a365d', width: '60px' }}>
                  Périodes
                </th>
                <th rowSpan={2} style={{ ...thBase, background: '#2b6cb0' }}>
                  Consomm-<br />ations
                </th>
                <th rowSpan={2} style={{ ...thBase, background: '#c53030' }}>
                  Stock avec<br />rupture<br />éventuelle
                </th>
                <th rowSpan={2} style={{ ...thBase, background: '#276749' }}>
                  Livraisons
                </th>
                <th rowSpan={2} style={{ ...thBase, background: '#2f855a', minWidth: '120px' }}>
                  Stock rectifié<br />en fonction<br />des entrées
                </th>
                <th colSpan={2} style={{ ...thBase, background: '#744210' }}>
                  Commandes
                </th>
              </tr>
              {/* Ligne 2 — sous-entêtes commandes */}
              <tr>
                <th style={{ ...thBase, background: '#975a16', minWidth: '100px' }}>
                  Date
                </th>
                <th style={{ ...thBase, background: '#975a16', minWidth: '80px' }}>
                  Quantité
                </th>
              </tr>
            </thead>

            <tbody>
              {tableau.map((row, idx) => {
                const ruptureEv = row.stock_rupture < 0;
                const ruptureRect = row.stock_rectifie < 0;
                const isInitial = row.mois_index === 0;

                return (
                  <tr
                    key={idx}
                    style={{
                      background: isInitial
                        ? '#ebf8ff'
                        : idx % 2 === 0
                          ? '#f7fafc'
                          : 'white',
                    }}
                  >
                    {/* Périodes */}
                    <td style={{
                      ...tdBase,
                      fontWeight: 700,
                      background: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.9rem',
                    }}>
                      {row.mois_label}
                    </td>

                    {/* Consommations */}
                    <td style={{ ...tdBase, color: '#4a5568' }}>
                      {row.consommation !== null ? fmt(row.consommation) : ''}
                    </td>

                    {/* Stock avec rupture éventuelle */}
                    <td style={{
                      ...tdBase,
                      background: ruptureEv ? '#fff5f5' : '#fefce8',
                      color: ruptureEv ? '#c53030' : '#92400e',
                      fontWeight: ruptureEv ? 700 : 400,
                    }}>
                      {ruptureEv
                        ? `(${fmt(Math.abs(row.stock_rupture))})`
                        : fmt(row.stock_rupture)}
                      {ruptureEv && (
                        <div style={{ fontSize: '0.7rem', color: '#e53e3e' }}>⚠ rupture</div>
                      )}
                    </td>

                    {/* Livraisons */}
                    <td style={{
                      ...tdBase,
                      color: '#276749',
                      fontWeight: row.livraison ? 700 : 400,
                      background: row.livraison ? '#f0fff4' : 'transparent',
                    }}>
                      {row.livraison ? fmt(row.livraison) : ''}
                    </td>

                    {/* Stock rectifié */}
                    <td style={{
                      ...tdBase,
                      fontWeight: 700,
                      background: ruptureRect ? '#fff5f5' : '#f0fff4',
                      color: ruptureRect ? '#c53030' : '#276749',
                    }}>
                      {fmt(row.stock_rectifie)}
                    </td>

                    {/* Commande — Date */}
                    <td style={{
                      ...tdBase,
                      color: '#744210',
                      background: row.commande ? '#fffbeb' : 'transparent',
                      fontStyle: 'normal',
                    }}>
                      {row.commande
                        ? row.commande.mois_commande_label
                        : ''}
                    </td>

                    {/* Commande — Quantité */}
                    <td style={{
                      ...tdBase,
                      fontWeight: row.commande ? 700 : 400,
                      color: '#744210',
                      background: row.commande ? '#fffbeb' : 'transparent',
                    }}>
                      {row.commande ? fmt(row.commande.quantite) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TABLEAU SYNTHÈSE — Format exact cours page 59-60
          Lignes : Commandes / Livraisons / Sorties / Stock
          Colonnes : D | J | F | M | A | M | J | Ju | A | S | O | N | D
          ══════════════════════════════════════════════════════════════ */}
      {synthese && <TableauSynthese synthese={synthese} fmt={fmt} />}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Composant Tableau Synthèse — reproduit EXACTEMENT page 59-60
   ════════════════════════════════════════════════════════════════ */
function TableauSynthese({ synthese, fmt }) {
  const { mois, commandes, livraisons, sorties, stock } = synthese;

  const thS = {
    padding: '7px 8px',
    border: '1px solid #718096',
    textAlign: 'center',
    fontSize: '0.82rem',
    fontWeight: 700,
    background: '#1a365d',
    color: 'white',
    whiteSpace: 'nowrap',
  };

  const tdS = (bg, color, bold) => ({
    padding: '6px 8px',
    border: '1px solid #cbd5e0',
    textAlign: 'center',
    fontSize: '0.84rem',
    background: bg || 'white',
    color: color || '#2d3748',
    fontWeight: bold ? 700 : 400,
    minWidth: '42px',
  });

  const ligneLabel = {
    padding: '7px 12px',
    border: '1px solid #718096',
    fontWeight: 700,
    fontSize: '0.85rem',
    background: '#2d3748',
    color: 'white',
    whiteSpace: 'nowrap',
  };

  return (
    <div>
      <div style={{
        background: '#1a365d', color: 'white', padding: '8px 14px',
        borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: '0.9rem',
      }}>
        Tableau de synthèse — Commandes / Livraisons / Sorties / Stock
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          borderCollapse: 'collapse',
          border: '2px solid #1a365d',
          width: '100%',
        }}>
          <thead>
            <tr>
              {/* Cellule vide en haut à gauche */}
              <th style={{ ...thS, background: '#4a5568', minWidth: '100px' }}></th>
              {mois.map((m, i) => (
                <th key={i} style={thS}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>

            {/* ── Ligne Commandes ── */}
            <tr>
              <td style={ligneLabel}>Commandes</td>
              {mois.map((_, i) => {
                const val = commandes[i];
                return (
                  <td key={i} style={tdS(val ? '#fffbeb' : 'white', '#744210', !!val)}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Livraisons ── */}
            <tr>
              <td style={ligneLabel}>Livraisons</td>
              {mois.map((_, i) => {
                const val = livraisons[i];
                return (
                  <td key={i} style={tdS(val ? '#f0fff4' : 'white', '#276749', !!val)}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Sorties (consommations) ── */}
            <tr>
              <td style={ligneLabel}>Sorties</td>
              {mois.map((_, i) => {
                const val = sorties[i];
                return (
                  <td key={i} style={tdS('white', val ? '#e53e3e' : '#a0aec0', false)}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Stock ── */}
            <tr>
              <td style={{ ...ligneLabel, background: '#1a365d' }}>Stock</td>
              {mois.map((_, i) => {
                const val = stock[i];
                const neg = val < 0;
                return (
                  <td key={i} style={tdS(
                    neg ? '#fff5f5' : '#ebf8ff',
                    neg ? '#c53030' : '#1e40af',
                    true
                  )}>
                    {val !== undefined ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}