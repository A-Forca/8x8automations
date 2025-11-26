interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? (
        <small style={{ display: 'block', color: '#94a3b8', marginTop: '0.25rem' }}>{hint}</small>
      ) : null}
    </div>
  );
}

