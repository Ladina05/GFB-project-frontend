import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function ResumeStockTable({ tableau, synthese, methode }) {
  if (!tableau || tableau.length === 0) return null;

  const fmt = (v) =>
    v !== null && v !== undefined && !isNaN(v)
      ? new Intl.NumberFormat('fr-FR').format(Math.round(v))
      : '';

  const titre =
    methode === 'quantites_constantes'
      ? 'Commandes à quantités constantes'
      : '§ 5.2 — Commandes par périodes constantes';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* ══════════════════════════════════════════════════════════════
          TABLEAU DÉTAILLÉ
          ══════════════════════════════════════════════════════════════ */}
      <div>
        <div className="rst-header">{titre}</div>

        <div className="rst-scroll">
          <table className="rst-table">
            <thead>
              {/* Ligne 1 — entêtes principales */}
              <tr>
                <th rowSpan={2} className="rst-th rst-th-period" style={{ width: '60px' }}>
                  Périodes
                </th>
                <th rowSpan={2} className="rst-th rst-th-conso">
                  Consomm-<br />ations
                </th>
                <th rowSpan={2} className="rst-th rst-th-rupture">
                  Stock avec<br />rupture<br />éventuelle
                </th>
                <th rowSpan={2} className="rst-th rst-th-livr">
                  Livraisons
                </th>
                <th rowSpan={2} className="rst-th rst-th-rect" style={{ minWidth: '120px' }}>
                  Stock rectifié<br />en fonction<br />des entrées
                </th>
                <th colSpan={2} className="rst-th rst-th-cmd">
                  Commandes
                </th>
              </tr>
              {/* Ligne 2 — sous-entêtes commandes */}
              <tr>
                <th className="rst-th rst-th-cmd-sub" style={{ minWidth: '100px' }}>
                  Date
                </th>
                <th className="rst-th rst-th-cmd-sub" style={{ minWidth: '80px' }}>
                  Quantité
                </th>
              </tr>
            </thead>

            <tbody>
              {tableau.map((row, idx) => {
                const ruptureEv   = row.stock_rupture < 0;
                const ruptureRect = row.stock_rectifie < 0;
                const isInitial   = row.mois_index === 0;

                const rowClass = isInitial
                  ? 'rst-row-init'
                  : idx % 2 === 0
                    ? 'rst-row-even'
                    : 'rst-row-odd';

                return (
                  <tr key={idx} className={rowClass}>
                    {/* Périodes */}
                    <td className="rst-td rst-td-period">
                      {row.mois_label}
                    </td>

                    {/* Consommations */}
                    <td className="rst-td rst-td-conso">
                      {row.consommation !== null ? fmt(row.consommation) : ''}
                    </td>

                    {/* Stock avec rupture éventuelle */}
                    <td className={`rst-td ${ruptureEv ? 'rst-td-rupture-bad' : 'rst-td-rupture-ok'}`}>
                      {ruptureEv
                        ? `(${fmt(Math.abs(row.stock_rupture))})`
                        : fmt(row.stock_rupture)}
                      {ruptureEv && (
                        <div className="rst-rupture-label">
                          <FontAwesomeIcon icon={faTriangleExclamation} /> rupture
                        </div>
                      )}
                    </td>

                    {/* Livraisons */}
                    <td className={`rst-td ${row.livraison ? 'rst-td-livr-val' : ''}`}>
                      {row.livraison ? fmt(row.livraison) : ''}
                    </td>

                    {/* Stock rectifié */}
                    <td className={`rst-td ${ruptureRect ? 'rst-td-rect-bad' : 'rst-td-rect-ok'}`}>
                      {fmt(row.stock_rectifie)}
                    </td>

                    {/* Commande — Date */}
                    <td className={`rst-td ${row.commande ? 'rst-td-cmd' : 'rst-td-cmd-empty'}`}>
                      {row.commande ? row.commande.mois_commande_label : ''}
                    </td>

                    {/* Commande — Quantité */}
                    <td className={`rst-td ${row.commande ? 'rst-td-cmd-qty' : 'rst-td-cmd-empty'}`}>
                      {row.commande ? fmt(row.commande.quantite) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═════════════════
          TABLEAU SYNTHÈSE
          ═════════════════ */}
      {synthese && <TableauSynthese synthese={synthese} fmt={fmt} />}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Composant Tableau Synthèse
   ════════════════════════════════════════════════════════════════ */
function TableauSynthese({ synthese, fmt }) {
  const { mois, commandes, livraisons, sorties, stock } = synthese;

  return (
    <div>
      <div className="rst-header">Tableau de synthèse</div>

      <div className="rst-scroll">
        <table className="rst-table">
          <thead>
            <tr>
              <th className="rst-synth-th rst-synth-th-corner"></th>
              {mois.map((m, i) => (
                <th key={i} className="rst-synth-th">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>

            {/* ── Ligne Commandes ── */}
            <tr>
              <td className="rst-synth-label">Commandes</td>
              {mois.map((_, i) => {
                const val = commandes[i];
                return (
                  <td key={i} className={`rst-synth-td ${val ? 'rst-synth-cmd' : 'rst-synth-cmd-empty'}`}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Livraisons ── */}
            <tr>
              <td className="rst-synth-label">Livraisons</td>
              {mois.map((_, i) => {
                const val = livraisons[i];
                return (
                  <td key={i} className={`rst-synth-td ${val ? 'rst-synth-livr' : 'rst-synth-livr-empty'}`}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Sorties ── */}
            <tr>
              <td className="rst-synth-label">Sorties</td>
              {mois.map((_, i) => {
                const val = sorties[i];
                return (
                  <td key={i} className={`rst-synth-td ${val ? 'rst-synth-sort' : 'rst-synth-sort-empty'}`}>
                    {val ? fmt(val) : ''}
                  </td>
                );
              })}
            </tr>

            {/* ── Ligne Stock ── */}
            <tr>
              <td className="rst-synth-label">Stock</td>
              {mois.map((_, i) => {
                const val = stock[i];
                const neg = val < 0;
                return (
                  <td key={i} className={`rst-synth-td ${neg ? 'rst-synth-stock-bad' : 'rst-synth-stock-ok'}`}>
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