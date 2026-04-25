export default function ResumeStockTable({ resume, commandes }) {
    if (!resume || resume.length === 0) return null;
  
    const fmt = (v) =>
      v !== null && v !== undefined
        ? new Intl.NumberFormat('fr-MG').format(Math.round(v))
        : '—';
  
    // Mapper les commandes par mois_index
    const cmdsParMois = {};
    if (commandes) {
      commandes.forEach((c) => {
        const key = c.mois_commande_index ?? c.mois_index;
        cmdsParMois[key] = c;
      });
    }
  
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mois</th>
              <th>Commandes</th>
              <th>Livraisons</th>
              <th>Sorties</th>
              <th>Stock</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {resume.map((row, i) => {
              const cmd = cmdsParMois[row.mois_index];
              return (
                <tr
                  key={i}
                  className={row.rupture ? '' : ''}
                  style={row.rupture ? { background: '#fff5f5' } : {}}
                >
                  <td><strong>{row.mois_label}</strong></td>
                  <td>
                    {cmd ? (
                      <span className="badge badge-warning">
                        📦 {fmt(cmd.quantite)} u
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    {row.livraisons ? (
                      <span className="badge badge-success">
                        ✅ +{fmt(row.livraisons)} u
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    {row.sorties ? (
                      <span style={{ color: '#e53e3e' }}>
                        -{fmt(row.sorties)} u
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <strong style={{ color: row.rupture ? '#e53e3e' : row.stock < 50 ? '#dd6b20' : '#2d3748' }}>
                      {fmt(row.stock)} u
                    </strong>
                  </td>
                  <td>
                    {row.rupture ? (
                      <span className="badge" style={{ background: '#fed7d7', color: '#c53030' }}>
                        ⚠️ Rupture
                      </span>
                    ) : row.stock < 50 ? (
                      <span className="badge badge-warning">⚡ Faible</span>
                    ) : (
                      <span className="badge badge-success">✓ OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }