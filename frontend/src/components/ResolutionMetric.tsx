interface ResolutionMetricProps {
    averageResolutionTimeHours:number;
}
function ResolutionMetric({averageResolutionTimeHours}:ResolutionMetricProps) {
    return(
        <div>
            <h2>Average Resolution Time</h2>
            <p>{averageResolutionTimeHours} hours</p>
        </div>
    )
}
export default ResolutionMetric