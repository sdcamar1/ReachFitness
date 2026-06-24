import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

const emptyForm = {
  service_type: "In-Person Training",
  focus: "Strength Training",
  commitment: "1x/week",
  obstacle: "",
  notes: "",
  promotion_code: "",
  name: "",
  email: "",
  phone: "",
  contact_preference: "Email",
};

const consultationDetails = {
  "In-Person Training":
    "Meet your trainer in person, tour the gym, formulate a plan, and schedule your sessions.",
  "Online Coaching":
    "Meet your trainer on Zoom, formulate a plan, and schedule your sessions.",
};

export function Book() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await api("/appointments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setConfirmation(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section className="confirmation page-section">
        <div className="confirmation-mark">
          <Check size={28} />
        </div>
        <p className="eyebrow">CONSULTATION REQUEST RECEIVED</p>
        <h1>
          You’re
          <br />
          <em>confirmed.</em>
        </h1>
        <div className="confirmation-details">
          <p>{confirmation.service_type}</p>
          <p>{confirmation.focus}</p>
          <p>{confirmation.commitment}</p>
        </div>
        <p>
          Your consultation request is confirmed. We will contact you shortly to
          review your goals and schedule the next step.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setConfirmation(null);
            setForm(emptyForm);
          }}
          data-testid="book-another"
        >
          Submit another request
        </Button>
      </section>
    );
  }

  return (
    <section className="booking-page page-section">
      <div className="booking-intro">
        <p className="eyebrow">FREE CONSULTATION</p>
        <h1>
          Start with
          <br />
          <em>a strategy.</em>
        </h1>
        <p>
          Complete a quick intake form so we can understand your goals before
          building the right training plan.
        </p>
      </div>

      <form className="booking-form" onSubmit={submit}>
        <section className="booking-step">
          <div className="step-label">
            <span>01</span>
            <h2>Format</h2>
          </div>
          <div className="form-grid">
            <label className="full-field">
              Consultation type
              <select
                name="service_type"
                value={form.service_type}
                onChange={updateField}
                data-testid="booking-service-type"
              >
                <option>In-Person Training</option>
                <option>Online Coaching</option>
              </select>
            </label>
            <p className="service-explainer full-field">
              {consultationDetails[form.service_type]}
            </p>
          </div>
        </section>

        <section className="booking-step">
          <div className="step-label">
            <span>02</span>
            <h2>Goals</h2>
          </div>
          <div className="form-grid">
            <label>
              Primary fitness or body composition goal
              <select
                name="focus"
                value={form.focus}
                onChange={updateField}
                data-testid="booking-focus"
              >
                <option>Strength Training</option>
                <option>Weight Loss</option>
                <option>Athletic Performance</option>
              </select>
            </label>
            <label>
              Weekly training commitment
              <select
                name="commitment"
                value={form.commitment}
                onChange={updateField}
                data-testid="booking-commitment"
              >
                <option>1x/week</option>
                <option>2x/week</option>
                <option>3+/week</option>
              </select>
            </label>
            <label className="full-field">
              Biggest obstacle to staying consistent
              <textarea
                required
                name="obstacle"
                rows="3"
                value={form.obstacle}
                onChange={updateField}
                data-testid="booking-obstacle"
              />
            </label>
            <label className="full-field">
              Other information I should know <span>(optional)</span>
              <textarea
                name="notes"
                rows="4"
                placeholder="Enter any promotional codes, prior injuries, or other information."
                value={form.notes}
                onChange={updateField}
                data-testid="booking-notes"
              />
            </label>
            <label>
              Promotion code <span>(optional)</span>
              <input
                name="promotion_code"
                value={form.promotion_code}
                onChange={updateField}
                data-testid="booking-promotion-code"
              />
            </label>
          </div>
        </section>

        <section className="booking-step">
          <div className="step-label">
            <span>03</span>
            <h2>Contact</h2>
          </div>
          <div className="form-grid">
            <label>
              Name
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                data-testid="booking-name"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                data-testid="booking-email"
              />
            </label>
            <label>
              Phone
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                data-testid="booking-phone"
              />
            </label>
            <label>
              Preferred contact method
              <select
                name="contact_preference"
                value={form.contact_preference}
                onChange={updateField}
                data-testid="booking-contact-preference"
              >
                <option>Email</option>
                <option>Phone</option>
                <option>Text</option>
              </select>
            </label>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            data-testid="submit-booking"
          >
            {submitting ? "Submitting..." : "Book a Consultation"}
            <ArrowRight size={18} />
          </Button>
        </section>
      </form>
      <a className="back-to-top" href="#top" data-testid="booking-back-top">
        <ArrowLeft size={16} /> Back to top
      </a>
    </section>
  );
}
