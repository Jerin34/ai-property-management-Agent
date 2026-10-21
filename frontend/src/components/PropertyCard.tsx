import { useNavigate } from "react-router-dom";
import type { Property } from "../types/property.types";

interface PropertyCardProps {
  property: Property;
}

function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  return (
    <div className="card card-interactive" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
            {property.name}
          </h3>
          <span className={`badge ${property.isActive ? "badge-completed" : "badge-neutral"}`}>
            {property.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div style={{ marginBottom: "1rem", color: "var(--text-body)", fontSize: "0.9rem" }}>
          <p style={{ margin: "0 0 0.25rem 0" }}>
            📍 {property.address.street}, {property.address.city}
          </p>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {property.address.state}, {property.address.country}
          </p>
        </div>

        {property.description && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property.description}
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={() => navigate(`/properties/${property._id}`)}
      >
        View Property Details →
      </button>
    </div>
  );
}

export default PropertyCard;