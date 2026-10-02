import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMaintenanceRequest } from "../api/maintenance.api";
function CreateMaintenancePage(){
    const navigate = useNavigate();
    const [propertyId,setPropertyId] = useState('');
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
    const [error,setError] = useState<string | null>(null);
    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setError(null);
        if(!propertyId.trim()){
            setError("Property ID is required.");
            return;
        }
        if(title.trim().length < 3){
            setError("Maintenance title must be at least 3 characters long.");
            return;
        }
        if(description.trim().length < 10){
            setError("Maintenance description must be at least 10 characters long.");
            return;
        }
        try{
            setIsSubmitting(true);
            const maintenance = await createMaintenanceRequest({
                propertyId:propertyId.trim(),title:title.trim(),description:description.trim()
            });
            navigate(`/maintenance/${maintenance._id}`,{replace: true});
        }
        catch(error){
            console.log("Failed to create maintenance request",error);
            setError("Failed to create maintenance request. Please try again later.");
        }
        finally{
            setIsSubmitting(false);
        }
    };
    return(
        <div>
            <h1>Create Maintenance Request</h1>
            {error&& (
                <p>{error}</p>
            )};
             <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="propertyId">
            Property ID
          </label>

          <input
            id="propertyId"
            type="text"
            value={propertyId}
            onChange={(event) =>
              setPropertyId(event.target.value)
            }
            placeholder="Enter property ID"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Example: AC Filter Replacement"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe the maintenance problem..."
            rows={6}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Request"}
        </button>
      </form>
        </div>
    )
}
export default CreateMaintenancePage