import { useEffect,useState } from "react";
import { getProperties } from "../api/property.api";
import PropertyCard from "../components/PropertyCard";
import type { Property } from "../types/property.types";
function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [error ,setError] = useState<string| null>(null);
    useEffect(() =>{
        const fetchProperties = async () =>{
            try{
                setIsLoading(true);
                setError(null); 
                const data = await getProperties();
                setProperties(data);
            }catch(error){
                console.log("Error loading properties",error);
                setError("Error loading properties");
            }finally{
                setIsLoading(false);
            }
        }
        fetchProperties();
    },[])
    if(isLoading){
        <p>Loading.........</p>
    }
    if(error){
        <p>{error}</p>
    }
    return(
        <div>
            <p>Total Properties: {properties.length}</p>
  {properties.length === 0 ? (
    <p>No properties found.</p>
  ) : (
    properties.map((property) => (
      <PropertyCard
        key={property._id}
        property={property}
      />
    ))
  )}
        </div>
    );
}
export default PropertiesPage;