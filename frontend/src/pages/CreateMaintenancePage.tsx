
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMaintenanceRequest } from "../api/maintenance.api";
import {
  getAvailableProperties,
  type AvailableProperty,
} from "../api/property.api";

function CreateMaintenancePage() {
  const navigate = useNavigate();

  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [properties, setProperties] = useState<AvailableProperty[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setError(null);
        const availableProperties = await getAvailableProperties();
        setProperties(availableProperties);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setError("Unable to load properties. Please refresh and try again.");
      } finally {
        setIsLoadingProperties(false);
      }
    };

    void loadProperties();
  }, []);

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selectedFiles.length === 0) return;

    if (photos.length + selectedFiles.length > 5) {
      setError("You can upload a maximum of 5 photos.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setError("Each photo must be 5 MB or smaller.");
      return;
    }

    setError(null);
    setPhotos((currentPhotos) => [...currentPhotos, ...selectedFiles]);
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((currentPhotos) =>
      currentPhotos.filter((_, index) => index !== indexToRemove)
    );
    setError(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);

    if (!propertyId) {
      setError("Please select a property.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Maintenance title must be at least 3 characters long.");
      return;
    }

    if (description.trim().length < 10) {
      setError("Maintenance description must be at least 10 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);

      const maintenance = await createMaintenanceRequest(
        {
          propertyId,
          title: title.trim(),
          description: description.trim(),
        },
        photos
      );

      navigate(`/maintenance/${maintenance._id}`, { replace: true });
    } catch (error) {
      console.error("Failed to create maintenance request:", error);

      const apiError = error as {
        response?: {
          data?: {
            code?: string;
            message?: string;
          };
        };
      };

      if (apiError.response?.data?.code === "AI_SERVICE_BUSY") {
        window.alert(
          "AI is currently busy. Please create your maintenance request later."
        );
        return;
      }

      setError(
        apiError.response?.data?.message ??
          "Failed to create maintenance request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">
            Create Maintenance Request
          </h1>
          <p className="page-header-subtitle">
            Select your property and describe the issue. Our AI triage
            system will automatically classify its priority and summarize it.
          </p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="propertyId">
              Select Property{" "}
              <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>

            <select
              id="propertyId"
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              disabled={
                isSubmitting ||
                isLoadingProperties ||
                properties.length === 0
              }
              required
            >
              <option value="">
                {isLoadingProperties
                  ? "Loading properties..."
                  : properties.length === 0
                    ? "No properties available"
                    : "Choose your property"}
              </option>

              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.name} — {property.address.street},{" "}
                  {property.address.city}
                </option>
              ))}
            </select>

            {!isLoadingProperties && properties.length === 0 && (
              <p className="page-header-subtitle">
                No properties were found. Please contact your property manager.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Request Title{" "}
              <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. AC cooling unit leaking water"
              disabled={isSubmitting}
              minLength={3}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Issue Description{" "}
              <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what happened, where it occurred, and how severe it is..."
              rows={5}
              minLength={10}
              maxLength={1000}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photos">
              Attach Photos (Optional)
            </label>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
              disabled={isSubmitting || photos.length >= 5}
            />
            <p className="page-header-subtitle">
              JPEG, PNG, or WebP. Maximum 5 photos, 5 MB per photo.
            </p>

            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${photo.lastModified}-${index}`}
                    style={{
                      border: "1px solid var(--border-color, #ddd)",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      minWidth: 0,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Maintenance photo ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "0.8rem",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {photo.name}
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removePhoto(index)}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                isSubmitting ||
                isLoadingProperties ||
                properties.length === 0
              }
            >
              {isSubmitting
                ? "Submitting Request..."
                : "Submit Maintenance Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMaintenancePage;
