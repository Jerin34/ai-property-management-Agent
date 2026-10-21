import { useEffect, useState } from "react";
import { getProperties } from "../api/property.api";
import PropertyCard from "../components/PropertyCard";
import type { Property } from "../types/property.types";

function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.log("Error loading properties", error);
        setError("Error loading properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading managed properties...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Properties Portfolio</h1>
          <p className="page-header-subtitle">
            Manage your real estate assets, monitor live building health scores, and review maintenance logs.
          </p>
        </div>
        <div className="page-header-actions">
          <span className="badge badge-neutral" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
            Total Properties: {properties.length}
          </span>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🏢</span>
          <h3>No Properties Found</h3>
          <p>There are no active properties registered in your portfolio yet.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;