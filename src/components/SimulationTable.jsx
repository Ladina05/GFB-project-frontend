import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

export default function SimulationTable({ simulations }) {
  if (!simulations || simulations.length === 0) return null;

  const formatter = (val) =>
    new Intl.NumberFormat('fr-MG').format(Math.round(val));

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Cadence N</th>
            <th>Qté/Commande</th>
            <th>Période (mois)</th>
            <th>Coût Passation</th>
            <th>Coût Possession</th>
            <th>Coût Total</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {simulations.map((sim, i) => (
            <tr key={i} className={sim.est_optimal ? 'optimal-row' : ''}>
              <td><strong>N = {sim.cadence_n}</strong></td>
              <td>{formatter(sim.quantite_par_commande || 0)}</td>
              <td>{sim.periode_mois ? `${sim.periode_mois} mois` : '-'}</td>
              <td>{formatter(sim.cout_passation)} Ar</td>
              <td>{formatter(sim.cout_possession)} Ar</td>
              <td><strong>{formatter(sim.cout_total)} Ar</strong></td>
              <td>
                {sim.est_optimal ? (
                  <span className="badge badge-success">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <span>Optimal</span>
                  </span>
                ) : (
                  <span className="badge badge-info">
                    <FontAwesomeIcon icon={faScaleBalanced} />
                    <span>Comparaison</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}