
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
      } catch (err) {
        console.error("Failed to create property:", err);
        setError("Could not create the property. Check the details and try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="create-property-page">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-header-title">Create Property</h1>
            <p className="page-header-subtitle">
              Add a property to your managed portfolio.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <section className="card create-property-card" aria-labelledby="property-form-title">
          <div className="create-property-form-intro">
            <h2 id="property-form-title">Property details</h2>
            <p>Enter the property name and address to add it to your portfolio.</p>
          </div>

          <form className="create-property-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Property name *</label>
              <input
                className="form-control"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={150}
                required
                disabled={isSubmitting}
              />
            </div>

            <fieldset className="create-property-address">
              <legend>Property address</legend>
              <div className="create-property-address-grid">
                <div className="form-group create-property-field-full">
                  <label className="form-label" htmlFor="street">Street *</label>
                  <input
                    className="form-control"
                    id="street"
                    name="address.street"
                    type="text"
                    value={formData.address.street}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">City *</label>
                  <input
                    className="form-control"
                    id="city"
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="state">State *</label>
                  <input
                    className="form-control"
                    id="state"
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postalcode">Postal code *</label>
                  <input
                    className="form-control"
                    id="postalcode"
                    name="address.postalcode"
                    type="text"
                    value={formData.address.postalcode}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="country">Country *</label>
                  <input
                    className="form-control"
                    id="country"
                    name="address.country"
                    type="text"
                    value={formData.address.country}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </fieldset>

            <div className="form-group create-property-description">
              <label className="form-label" htmlFor="description">Description (optional)</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                disabled={isSubmitting}
              />
              <span className="create-property-help">Add a short note to help your team identify this property.</span>
            </div>

            <div className="create-property-actions">
              <button
                className="btn btn-secondary"
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate("/properties")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating property..." : "Create Property"}
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  export default CreatePropertyPage;
