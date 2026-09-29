import type {Property} from '../types/property.types'
interface PropertyCardProps{
    property:Property
}
function PropertyCard({property}:PropertyCardProps){
    return(
        <div>
            <h2>{property.name}</h2>
              <p>
        {property.address.street},{" "}
        {property.address.city}
      </p>

      <p>
        {property.address.state},{" "}
        {property.address.country}
      </p>

      <p>
        Status:{" "}
        {property.isActive ? "Active" : "Inactive"}
      </p>

      {property.description && (
        <p>{property.description}</p>
      )}
        </div>
    )
}
export default PropertyCard