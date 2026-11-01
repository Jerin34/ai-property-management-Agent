import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty, type CreatePropertyRequest } from "../api/property.api";
import type { Property } from "../types/property.types";

function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [form, setForm] = useState<CreatePropertyRequest>({
    name: "",
    address: { street: "", city: "", state: "", postalcode: "", country: "" },
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) return;
      try {
        const data = await getPropertyById(id);
        if (!active) return;
        setProperty(data);
        setForm({
          name: data.name,
          address: { ...data.address },
          description: data.description ?? "",
          ...(data.location ? { location: data.location } : {}),
        });
      } catch (err) {
        console.error("Failed to load property for editing:", err);
        if (active) setError("Unable to load this property. Check that you manage it.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  const updateAddress = (field: keyof CreatePropertyRequest["address"], value: string) => {
    setForm((current) => ({ ...current, address: { ...current.address, [field]: value } }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      await updateProperty(id, {
        name: form.name.trim(),
        address: {
          street: form.address.street.trim(),
          city: form.address.city.trim(),
          state: form.address.state.trim(),
          postalcode: form.address.postalcode.trim(),
          country: form.address.country.trim(),
        },
        description: form.description?.trim() ?? "",
        ...(form.location ? { location: form.location } : {}),
      });
      navigate(`/properties/${id}`, { replace: true });
    } catch (err) {
      console.error("Failed to update property:", err);
      setError("Unable to save property details. Review the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading property...</p></div>;
  if (!property) return <div className="alert-error" role="alert">{error || "Property not found."}</div>;

  return (
    <section className="create-property-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Edit Property</h1>
          <p className="page-header-subtitle">Update the details for {property.name}.</p>
        </div>
      </div>
      {error && <div className="alert-error" role="alert">{error}</div>}
      <form className="create-property-form" onSubmit={submit}>
        <div className="create-property-field">
          <label htmlFor="property-name">Property name</label>
          <input id="property-name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} minLength={2} maxLength={150} required disabled={saving} />
        </div>
        <h2>Address</h2>
        <div className="create-property-fields-grid">
          <div className="create-property-field create-property-field-full"><label htmlFor="street">Street</label><input id="street" value={form.address.street} onChange={(e) => updateAddress("street", e.target.value)} required disabled={saving} /></div>
          <div className="create-property-field"><label htmlFor="city">City</label><input id="city" value={form.address.city} onChange={(e) => updateAddress("city", e.target.value)} required disabled={saving} /></div>
          <div className="create-property-field"><label htmlFor="state">State</label><input id="state" value={form.address.state} onChange={(e) => updateAddress("state", e.target.value)} required disabled={saving} /></div>
          <div className="create-property-field"><label htmlFor="postalcode">Postal code</label><input id="postalcode" value={form.address.postalcode} onChange={(e) => updateAddress("postalcode", e.target.value)} required disabled={saving} /></div>
          <div className="create-property-field"><label htmlFor="country">Country</label><input id="country" value={form.address.country} onChange={(e) => updateAddress("country", e.target.value)} required disabled={saving} /></div>
        </div>
        <div className="create-property-field"><label htmlFor="description">Description</label><textarea id="description" value={form.description ?? ""} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} maxLength={500} rows={4} disabled={saving} /></div>
        <div className="create-property-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/properties/${id}`)} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </section>
  );
}
export default EditPropertyPage;
