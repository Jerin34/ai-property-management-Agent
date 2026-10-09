import { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import { createMaintenanceSchedule } from "../api/maintenance-scheduler.api";
import { getProperties } from "../api/property.api";
import type { CreateMaintenanceSchedule } from "../types/maintenance-scheduler.types";
import type { Property } from "../types/property.types";

function CreateMaintenanceSchedulePage(){
    const navigate = useNavigate()
    const [properties, setProperties] = useState<Property[]>([]);
    const [formData,setformData] = useState<CreateMaintenanceSchedule>({
        property:"",
        title:"",
        description:"",
        category:"OTHER",
        frequency:"MONTHLY",
        nextDueDate:"",
        isActive:true,
    })
    const [loading,setLoading] = useState(false);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [error,setError] = useState<string | null>(null);
    useEffect(() => {
        const loadProperties = async() =>{
            try{
                setLoading(true);
                setError(null);
                const data = await getProperties();
                setProperties(data);
            }catch(error){
                console.error("Failed to load Properties",error);
                setError("Failed to load Properties")
            }finally{
                setLoading(false);
            }
        }
        loadProperties();
    },[]);
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        const {name, value} = e.target;
        setformData((prev) =>({
            ...prev,[name]:value
        }))
    };
    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault();
        try{
            setIsSubmitting(true);
            setError(null);
            await createMaintenanceSchedule(formData);
            navigate("/maintenance/schedules");
        }catch(err){
            console.error("Failed to create Maintenance Schedule",err);
                setError("Failed to create Maintenance Schedule")
        }finally{
            setIsSubmitting(false);
        }
    }

    if(loading){
        return <p>Loading...</p>
    }
    return(
          <div>

            <h1>Create Maintenance Schedule</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Property
                    </label>

                    <select
                        name="property"
                        value={formData.property}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Property
                        </option>

                        {properties.map((property) => (

                            <option
                                key={property._id}
                                value={property._id}
                            >
                                {property.name}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <label>
                        Category
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >

                        <option value="PLUMBING">
                            Plumbing
                        </option>

                        <option value="ELECTRICAL">
                            Electrical
                        </option>

                        <option value="HVAC">
                            HVAC
                        </option>

                        <option value="APPLIANCE">
                            Appliance
                        </option>

                        <option value="STRUCTURAL">
                            Structural
                        </option>

                        <option value="OTHER">
                            Other
                        </option>

                    </select>

                </div>

                <div>

                    <label>
                        Frequency
                    </label>

                    <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                    >

                        <option value="DAILY">
                            Daily
                        </option>

                        <option value="WEEKLY">
                            Weekly
                        </option>

                        <option value="MONTHLY">
                            Monthly
                        </option>

                        <option value="QUARTERLY">
                            Quarterly
                        </option>

                        <option value="YEARLY">
                            Yearly
                        </option>

                    </select>

                </div>

                <div>

                    <label>
                        Next Due Date
                    </label>

                    <input
                        type="date"
                        name="nextDueDate"
                        value={formData.nextDueDate}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) =>
                                setformData((previous) => ({
                                    ...previous,
                                    isActive: e.target.checked
                                }))
                            }
                        />

                        Active
                    </label>

                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Creating..."
                        : "Create Schedule"}
                </button>

            </form>

        </div>
    )
}
export default CreateMaintenanceSchedulePage