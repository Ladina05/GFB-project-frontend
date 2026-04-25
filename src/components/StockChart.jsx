import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function StockChart({ resume, point_commande }) {
  if (!resume || resume.length === 0) return null;

  // Accepte le nouveau format tableau (avec mois_label, stock_rectifie, livraison, consommation)
  const data = resume.map((r) => ({
    mois: r.mois_label,
    Stock: r.stock_rectifie ?? r.stock ?? 0,
    Livraisons: r.livraison ?? r.livraisons ?? 0,
    Consommations: r.consommation ?? r.sorties ?? 0,
  }));

  const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(v || 0));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
        <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
        <Tooltip formatter={(v, name) => [fmt(v), name]} />
        <Legend />
        {point_commande > 0 && (
          <ReferenceLine
            y={point_commande}
            stroke="#e53e3e"
            strokeDasharray="6 4"
            label={{
              value: `SCM = ${fmt(point_commande)}`,
              fill: '#e53e3e',
              fontSize: 11,
              position: 'right',
            }}
          />
        )}
        <Bar dataKey="Livraisons" fill="#68d391" opacity={0.75} name="Livraisons" />
        <Bar dataKey="Consommations" fill="#fc8181" opacity={0.65} name="Consommations" />
        <Line
          type="stepAfter"
          dataKey="Stock"
          stroke="#3182ce"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#3182ce' }}
          name="Stock"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}