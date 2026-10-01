import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertiesHealth,
  getPropertyCopilot,
} from "../api/property.api";

import type { Property } from "../types/property.types";
import type { PropertyHealthResult } from "../types/property-health.types";
import type { PropertyCopilotResult } from "../types/property-copilot.types";

import CopilotPanel from "../components/CopilotPanel";

function PropertyDetailsPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [health, setHealth] = useState<PropertyHealthResult | null>(null);
  const [copilot, setCopilot] = useState<PropertyCopilotResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCopilotLoading, setIsCopilotLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Fetch property and health
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const [propertyData, healthData] = await Promise.all([
          getPropertyById(id),
          getPropertiesHealth(id),
        ]);

        setProperty(propertyData);
        setHealth(healthData);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError("Failed to load property.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Fetch AI Copilot separately
  useEffect(() => {
    const fetchCopilot = async () => {
      if (!id) return;

      try {
        setIsCopilotLoading(true);

        const copilotData = await getPropertyCopilot(id);

        setCopilot(copilotData);
      } catch (error) {
        console.error("Failed to fetch Copilot:", error);
      } finally {
        setIsCopilotLoading(false);
      }
    };

    fetchCopilot();
  }, [id]);

  if (isLoading) {
    return <p>Loading property...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!property) {
    return <p>Property not found.</p>;
  }

  return (
    <div>
      <h1>{property.name}</h1>

      <h2>Address</h2>

      <p>{property.address.street}</p>
      <p>{property.address.city}</p>
      <p>{property.address.state}</p>
      <p>{property.address.postalcode}</p>
      <p>{property.address.country}</p>

      <h2>Property Information</h2>

      <p>
        Status: {property.isActive ? "Active" : "Inactive"}
      </p>

      {property.description && (
        <p>{property.description}</p>
      )}

      <h2>Location</h2>

      <a
        href={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Property Location
      </a>

      <h2>Property Health</h2>

      {health ? (
        <div>
          <p>Health Score: {health.healthScore}</p>
          <p>Risk Level: {health.riskLevel}</p>
          <p>Total Requests: {health.totalRequests}</p>
          <p>
            High Priority Requests: {health.highPriorityRequests}
          </p>
          <p>
            Emergency Requests: {health.emergencyRequests}
          </p>
          <p>Open Requests: {health.openRequests}</p>

          <h3>Reasons</h3>

          {health.reasons.length === 0 ? (
            <p>No health issues detected.</p>
          ) : (
            <ul>
              {health.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Property health unavailable.</p>
      )}

      <CopilotPanel
        copilot={copilot}
        isLoading={isCopilotLoading}
      />
    </div>
  );
}

export default PropertyDetailsPage;