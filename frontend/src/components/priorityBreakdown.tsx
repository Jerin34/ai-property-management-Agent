interface PriorityBreakdownProps {
    data:{
        LOW:number;
        MEDIUM:number;
        HIGH:number;
        EMERGENCY:number;
    };
}

function PriorityBreakdown({data}:PriorityBreakdownProps){
    return(
        <div>
            <h2>Requests by Prpiority</h2>
            <p>Low :{data.LOW}</p>
            <p>Medium :{data.MEDIUM}</p>
            <p>High :{data.HIGH}</p>
            <p>Emergency :{data.EMERGENCY}</p>
        </div>
    )
}
export default PriorityBreakdown