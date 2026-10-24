
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
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-header-title">Create Property</h1>
            <p className="page-header-subtitle">
              Add a property to your managed portfolio.
            </p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Property name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              maxLength={150}
              required
              disabled={isSubmitting}
            />
          </div>

          <h3>Address</h3>

          <div>
            <label htmlFor="street">Street *</label>
            <input
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="city">City *</label>
            <input
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="state">State *</label>
            <input
              id="state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="postalcode">Postal code *</label>
            <input
              id="postalcode"
              name="address.postalcode"
              value={formData.address.postalcode}
              onChange={handleChange}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="country">Country *</label>
            <input
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating property..." : "Create Property"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate("/properties")}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  export default CreatePropertyPage;
