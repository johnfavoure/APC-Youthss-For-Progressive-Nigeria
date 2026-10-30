"use client";

import { FormEvent, useState } from "react";

const states = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
];

export default function RegisterForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration could not be submitted.");
      setMessage("Your application has been received and is pending administrative review. Your reference is " + result.reference + ".");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Full name<input name="fullName" autoComplete="name" required minLength={3} maxLength={100} placeholder="Enter your full name" /></label>
        <label>Date of birth<input name="dateOfBirth" type="date" required /></label>
        <label>Email address <span className="optional">(optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={20} placeholder="e.g. 08012345678" /></label>
        <label>State of residence<select name="stateName" required defaultValue=""><option value="" disabled>Select state</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
        <label>Local Government Area<input name="lgaName" required maxLength={100} placeholder="Enter your LGA" /></label>
        <label className="full-field">Ward <span className="optional">(if known)</span><input name="wardName" maxLength={100} placeholder="Enter your ward" /></label>
        <label className="full-field">Residential address <span className="optional">(optional)</span><input name="address" maxLength={250} placeholder="Street / community (avoid unnecessary details)" /></label>
        <label className="full-field">Create password<input name="password" type="password" required minLength={12} maxLength={100} autoComplete="new-password" placeholder="At least 12 characters" /></label>
      </div>
      <label className="consent"><input type="checkbox" name="privacyConsent" value="yes" required /><span>I have read the privacy notice and consent to the organization processing the information necessary to review this membership application. I understand that membership is not confirmed until approved.</span></label>
      <p className="privacy-note">Do not enter your NIN, BVN, bank details or other highly sensitive identifiers in this form.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="button button-primary submit-button" disabled={busy}>{busy ? "Submitting…" : "Submit application"} <span>→</span></button>
    </form>
  );
}
