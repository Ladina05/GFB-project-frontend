import {
    ComposedChart, Bar, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ReferenceLine,
  } from 'recharts';
  
  export default function StockChart({ resume, point_commande, titre }) {
    if (!resume || resume.length === 0) return null;
  
    const data = resume.map((r) => ({
      mois: r.mois_label,
      Stock: r.stock,
      Livraisons: r.livraisons || 0,
      Consommations: r.sorties || 0,
      rupture: r.rupture,
    }));
  
    return (
      <div>
        {titre && (
          <h4 style={{ marginBottom: '0.75rem', color: '#2d3748', fontSize: '0.95rem' }}>
            {titre}
          </h4>
        )}
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
            <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, name) => [
                new Intl.NumberFormat('fr-MG').format(v),
                name,
              ]}
            />
            <Legend />
            {point_commande && (
              <ReferenceLine
                y={point_commande}
                stroke="#e53e3e"
                strokeDasharray="5 5"
                label={{ value: `SCM=${Math.round(point_commande)}`, fill: '#e53e3e', fontSize: 11 }}
              />
            )}
            <Bar dataKey="Livraisons" fill="#68d391" opacity={0.7} name="Livraisons" />
            <Bar dataKey="Consommations" fill="#fc8181" opacity={0.6} name="Consommations" />
            <Line
              type="stepAfter"
              dataKey="Stock"
              stroke="#3182ce"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Stock"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }