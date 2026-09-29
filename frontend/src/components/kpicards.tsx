interface KpiCardsProps{
    title:string;
    value:number;
}
function KpiCard({title,value}:KpiCardsProps){
    return(
        <div className="kpi-card">
            <p className="kpi-card-value">{value}</p>
            <h2 className="kpi-card-title" >{title}</h2>
        </div>
    )
}
export default KpiCard