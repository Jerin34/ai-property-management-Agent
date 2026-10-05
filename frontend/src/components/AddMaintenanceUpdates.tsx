import {useState} from 'react'
interface AddMaintenanceUpateProps{
    maintenanceId:string;
    onUpdateCreated:() =>void;
}
import { createMaintenanceUpdate } from '../api/maintenance.api';
function AddMaintenanceUpdate({
    maintenanceId,
    onUpdateCreated,}
    :AddMaintenanceUpateProps
){
    const [message,setMessage] = useState("");
    const [isLoading,setiSLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);
    const handleSubmit = async() =>{
        if(!message.trim()){
            setError("Update Message Cannot Be Empty")
        }
        try{
            setiSLoading(true);
            setError(null);
            await createMaintenanceUpdate(maintenanceId,
                {
                    message:message.trim(),
                });
                setMessage('');
                onUpdateCreated();
        }
        catch(err){
            console.log("Error in creating Maintenance Updates",err)
            setError("Failed to create maintenance update")
        }
        finally{
            setiSLoading(false);
    }
}
    return(
        <div>
            <h1>Add Update</h1>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter Your Maintenance Update here' />
                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Adding Update..." : "Add Update"}
                </button>
                {error && <p>{error}</p>}
        </div>
    );

}
export default AddMaintenanceUpdate