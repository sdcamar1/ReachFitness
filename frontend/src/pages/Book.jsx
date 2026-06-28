import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

const weekendSlots = ["09:00", "12:00", "15:00", "18:00"];
const weekdaySlots = ["18:00"];
const labels = {
  "09:00": "9:00 AM",
  "12:00": "12:00 PM",
  "15:00": "3:00 PM",
  "18:00": "6:00 PM",
};

const emptyForm = {
  service_type: "In-Person Training",
  success_vision: "",
  previous_training: "No",
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
  const [selected, setSelected] = useState();
  const [time, setTime] = useState("");
  const [booked, setBooked] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const slots = useMemo(() => {
    if (!selected) return [];
    return selected.getDay() === 0 || selected.getDay() === 6
      ? weekendSlots
      : weekdaySlots;
  }, [selected]);

  useEffect(() => {
    setTime("");
    if (!selected) return;
    api(`/appointments/booked?date=${format(selected, "yyyy-MM-dd")}`)
      .then((result) => setBooked(result.times))
      .catch(() => {
        setBooked([]);
      });
  }, [selected]);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!selected || !time) {
      toast.error("Choose a consultation date and time first.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api("/appointments", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          date: format(selected, "yyyy-MM-dd"),
          time,
        }),
      });
      setConfirmation(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    const displayDate = format(
      new Date(`${confirmation.date}T12:00:00`),
      "EEEE, MMMM d, yyyy",
    );
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
          <p>{displayDate}</p>
          <p>{labels[confirmation.time]}</p>
          <p>{confirmation.service_type}</p>
          <p>{confirmation.focus}</p>
          <p>{confirmation.commitment}</p>
        </div>
        <p>
          Your consultation is confirmed. We will contact you shortly to review
          your goals and prepare for the next step.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setConfirmation(null);
            setSelected(undefined);
            setTime("");
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
            <h2>Schedule</h2>
          </div>
          <div className="booking-scheduler">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              disabled={{ before: new Date() }}
              data-testid="booking-calendar"
            />
            <div className="scheduler-times">
              <p className="scheduler-help">
                Choose a date and available time for your free consultation.
              </p>
              {!selected ? (
                <p className="muted">Select a date to see available times.</p>
              ) : (
                <div className="time-grid">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      disabled={booked.includes(slot)}
                      className={time === slot ? "selected" : ""}
                      onClick={() => setTime(slot)}
                      data-testid={`time-${slot.replace(":", "")}`}
                    >
                      {labels[slot]}
                      {booked.includes(slot) && <small>Booked</small>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="booking-step">
          <div className="step-label">
            <span>02</span>
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
            <span>03</span>
            <h2>Goals</h2>
          </div>
          <div className="form-grid">
            <label>
              Have you previously tried personal training?
              <select
                name="previous_training"
                value={form.previous_training}
                onChange={updateField}
                data-testid="booking-previous-training"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
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
              What does success look like to you 3+ months from now?
              <textarea
                required
                name="success_vision"
                rows="3"
                value={form.success_vision}
                onChange={updateField}
                data-testid="booking-success-vision"
              />
            </label>
            <label className="full-field">
              What is your biggest obstacle to staying consistent?
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
                placeholder="Enter any prior injuries or other information."
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
            <span>04</span>
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
