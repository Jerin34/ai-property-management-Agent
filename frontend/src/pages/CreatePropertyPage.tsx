import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProperty,
  type CreatePropertyRequest,
} from "../api/property.api";

function CreatePropertyPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreatePropertyRequest>({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalcode: "",
      country: "",
    },
    description: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as keyof CreatePropertyRequest["address"];

      setFormData((previous) => ({
        ...previous,
        address: {
          ...previous.address,
          [field]: value,
        },
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: CreatePropertyRequest = {
        name: formData.name.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          postalcode: formData.address.postalcode.trim(),
          country: formData.address.country.trim(),
        },
        ...(formData.description?.trim()
          ? { description: formData.description.trim() }
          : {}),
      };

      await createProperty(payload);
      navigate("/properties", { replace: true });
    } catch {
      setError("Could not create the property. Check the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="create-property-page">
      <div className="page-header create-property-header">
        <div className="page-header-left">
          <span className="create-property-eyebrow">PROPERTY MANAGEMENT</span>
          <h1 className="page-header-title">Create Property</h1>
          <p className="page-header-subtitle">
            Add a new property to your managed portfolio.
          </p>
        </div>
        <div className="create-property-header-icon" aria-hidden="true">⌂</div>
      </div>

      {error && (
        <div className="alert-error create-property-error" role="alert">
          {error}
        </div>
      )}

      <form className="create-property-form" onSubmit={handleSubmit}>
        <div className="create-property-section-heading">
          <div>
            <h2>Property details</h2>
            <p>Start with a name, then provide the property's location.</p>
          </div>
          <span className="create-property-required">* Required fields</span>
        </div>

        <div className="create-property-field create-property-field-full">
          <label htmlFor="name">Property name <span>*</span></label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Greenview Apartments"
            minLength={2}
            maxLength={150}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="create-property-section-heading create-property-address-heading">
          <div>
            <h2>Property address</h2>
            <p>Enter the complete address for this property.</p>
          </div>
        </div>

        <div className="create-property-fields-grid">
          <div className="create-property-field create-property-field-full">
            <label htmlFor="street">Street address <span>*</span></label>
            <input
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Building, street, area"
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="create-property-field">
            <label htmlFor="city">City <span>*</span></label>
            <input
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="City"
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="create-property-field">
            <label htmlFor="state">State <span>*</span></label>
            <input
              id="state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              placeholder="State"
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="create-property-field">
            <label htmlFor="postalcode">Postal code <span>*</span></label>
            <input
              id="postalcode"
              name="address.postalcode"
              value={formData.address.postalcode}
              onChange={handleChange}
              placeholder="Postal code"
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="create-property-field">
            <label htmlFor="country">Country <span>*</span></label>
            <input
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              placeholder="Country"
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="create-property-field create-property-description">
          <label htmlFor="description">Description <span className="optional-label">Optional</span></label>
          <textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            placeholder="Add useful details about this property..."
            maxLength={500}
            rows={4}
            disabled={isSubmitting}
          />
          <span className="create-property-field-hint">Up to 500 characters.</span>
        </div>

        <div className="create-property-actions">
          <button
            className="btn btn-secondary create-property-cancel"
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate("/properties")}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary create-property-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating property..." : "Create Property"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePropertyPage;
