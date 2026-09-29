interface PropertyIssues{
    propertyId:string;
    propertyName:string;
    requestCount:number;
}
interface PropertyIssuesProps{
    data:PropertyIssues[];
}
function PropertyIssues({data}:PropertyIssuesProps){
    return(
        <div>
            <h2>Property Issues</h2>
            {data.length === 0 ? (
                <p>No Property Issues Available</p>
            ):(
                data.map((property) =>(
                    <div key={property.propertyId} className="property-issue">
                        <h3>{property.propertyName}</h3>
                        <p>{property.requestCount}</p>
                    </div>
                ))
            )}
        </div>
    )
}
export default PropertyIssues