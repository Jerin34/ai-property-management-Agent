import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  getTechnicianProfile,
  updateTechnicianProfile,
  type TechnicianAvailability,
  type TechnicianProfileInput,
  type TechnicianSkill,
} from "../api/technician.api";

const skillOptions: { value: TechnicianSkill; label: string }[] = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HVAC", label: "HVAC" },
  { value: "APPLIANCE", label: "Appliance repair" },
  { value: "STRUCTURAL", label: "Structural repairs" },
  { value: "OTHER", label: "General maintenance" },
];

const emptyForm: TechnicianProfileInput = {
  skills: [],
  experienceYears: 0,
  serviceAreas: [],
  availability: "FULL_TIME",
  workingHours: { start: "09:00", end: "17:00" },
  bio: "",
};

function TechnicianProfilePage() {
  const [form, setForm] = useState<TechnicianProfileInput>(emptyForm);
  const [areaInput, setAreaInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const profile = await getTechnicianProfile();
        if (cancelled) return;
        setForm({
          skills: profile.skills || [],
          experienceYears: profile.experienceYears ?? 0,
          serviceAreas: profile.serviceAreas || [],
          availability: profile.availability || "FULL_TIME",
          workingHours: profile.workingHours || { start: "09:00", end: "17:00" },
          bio: profile.bio || "",
        });
        setCompleted(profile.profileCompleted);
      } catch (err) {
        if (!cancelled) {
          setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to load profile." : "Failed to load profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const toggleSkill = (skill: TechnicianSkill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }));
  };

  const addArea = () => {
    const area = areaInput.trim();
    if (area && !form.serviceAreas.includes(area)) {
      setForm((current) => ({ ...current, serviceAreas: [...current.serviceAreas, area] }));
    }
    setAreaInput("");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const profile = await updateTechnicianProfile(form);
      setCompleted(profile.profileCompleted);
      setMessage(profile.profileCompleted
        ? "Profile saved. You are now eligible to receive Technician assignments."
        : "Profile updated. Complete all required fields to become eligible for assignments.");
    } catch (err) {
      setError(axios.isAxiosError(err)
        ? err.response?.data?.message || "Unable to save profile."
        : err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><p>Loading Technician profile...</p></div>;

  return (
    <main className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Technician Profile</h1>
        <p className="mt-1 text-sm text-gray-600">Add your capabilities and working preferences so Managers can assign suitable maintenance jobs.</p>
      </header>

      <div className={`rounded-lg border p-4 ${completed ? "border-green-200 bg-green-50 text-green-900" : "border-amber-200 bg-amber-50 text-amber-900"}`} role="status">
        <strong>{completed ? "Profile complete — assignment eligible" : "Complete your profile to receive assignments"}</strong>
        <p className="mt-1 text-sm">{completed ? "You can update these details at any time." : "Your account is active, but the system blocks new assignments until all required profile details are saved."}</p>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-blue-800">{message}</p>}

      <form onSubmit={save} className="space-y-6 rounded-xl border bg-white p-5 shadow-sm">
        <section>
          <h2 className="font-semibold">Skills <span className="text-red-600">*</span></h2>
          <p className="mb-3 text-sm text-gray-500">Select every type of work you are qualified to handle.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillOptions.map((skill) => (
              <label key={skill.value} className="flex items-center gap-2 rounded-lg border p-3">
                <input type="checkbox" checked={form.skills.includes(skill.value)} onChange={() => toggleSkill(skill.value)} />
                <span>{skill.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Years of experience <span className="text-red-600">*</span>
            <input type="number" min="0" max="60" value={form.experienceYears} onChange={(e) => setForm((current) => ({ ...current, experienceYears: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border p-2.5" required />
          </label>
          <label className="block text-sm font-medium">
            Availability <span className="text-red-600">*</span>
            <select value={form.availability} onChange={(e) => setForm((current) => ({ ...current, availability: e.target.value as TechnicianAvailability }))} className="mt-1 w-full rounded-lg border p-2.5">
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="FLEXIBLE">Flexible</option>
            </select>
          </label>
        </section>

        <section>
          <h2 className="font-semibold">Service areas <span className="text-red-600">*</span></h2>
          <p className="mb-2 text-sm text-gray-500">Add the cities, towns or local areas where you can work.</p>
          <div className="flex gap-2">
            <input value={areaInput} onChange={(e) => setAreaInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArea(); } }} placeholder="e.g. Kozhikode" className="min-w-0 flex-1 rounded-lg border p-2.5" />
            <button type="button" onClick={addArea} className="rounded-lg border px-4">Add</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.serviceAreas.map((area) => (
              <button key={area} type="button" onClick={() => setForm((current) => ({ ...current, serviceAreas: current.serviceAreas.filter((item) => item !== area) }))} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm">
                {area} ×
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Working hours <span className="text-red-600">*</span></h2>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Start time
              <input type="time" value={form.workingHours.start} onChange={(e) => setForm((current) => ({ ...current, workingHours: { ...current.workingHours, start: e.target.value } }))} className="mt-1 w-full rounded-lg border p-2.5" required />
            </label>
            <label className="block text-sm">End time
              <input type="time" value={form.workingHours.end} onChange={(e) => setForm((current) => ({ ...current, workingHours: { ...current.workingHours, end: e.target.value } }))} className="mt-1 w-full rounded-lg border p-2.5" required />
            </label>
          </div>
        </section>

        <label className="block text-sm font-medium">
          Short professional bio (optional)
          <textarea value={form.bio || ""} onChange={(e) => setForm((current) => ({ ...current, bio: e.target.value }))} maxLength={500} rows={4} placeholder="Describe your experience or the work you specialize in." className="mt-1 w-full rounded-lg border p-2.5" />
        </label>

        <button type="submit" disabled={saving} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving profile..." : "Save Technician Profile"}
        </button>
      </form>
    </main>
  );
}

export default TechnicianProfilePage;
