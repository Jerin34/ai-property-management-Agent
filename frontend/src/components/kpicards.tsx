interface KpiCardsProps {
  title: string;
  value: number;
}

function KpiCard({ title, value }: KpiCardsProps) {
  return (
    <div className="kpi-card">
      <h3 className="kpi-card-title">{title}</h3>
      <div className="kpi-card-value">{value}</div>
    </div>
  );
}

export default KpiCard;