export default function FormulaCard({ titre, formule, explication }) {
  return (
    <div className="formula-box">
      <h4>📐 {titre}</h4>
      <div className="formula">{formule}</div>
      {explication && (
        <p style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.5rem' }}>
          {explication}
        </p>
      )}
    </div>
  );
}