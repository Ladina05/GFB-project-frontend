import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons';

export default function FormulaCard({ titre, formule, explication }) {
  return (
    <div className="formula-box">
      <h4>
        <FontAwesomeIcon icon={faDraftingCompass} />
        <span>{titre}</span>
      </h4>
      <div className="formula">{formule}</div>
      {explication && (
        <p style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.5rem' }}>
          {explication}
        </p>
      )}
    </div>
  );
}