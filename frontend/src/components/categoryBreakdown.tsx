interface CategoryBreakdownProps {
    data:{
        PLUMBING:number;
        ELECTRICAL:number;
        HVAC:number;
        APPLIANCE:number;
        STRUCTURAL:number;
        OTHER:number;
    };
}
function CategroyBreakdown({data}:CategoryBreakdownProps) { 
    return(
        <div>
            <h2>Requests by Category</h2>
            <p>Plumbing :{data.PLUMBING}</p>
            <p>Electrical :{data.ELECTRICAL}</p>
            <p>HVAC :{data.HVAC}</p>
            <p>Appliance :{data.APPLIANCE}</p>
            <p>Structural :{data.STRUCTURAL}</p>
            <p>Other :{data.OTHER}</p>
            </div>
    )

}
export default CategroyBreakdown;
