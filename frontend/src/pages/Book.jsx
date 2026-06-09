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
  name: "",
  email: "",
  phone: "",
  focus: "Strength Training",
  notes: "",
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
      .catch((error) => toast.error(error.message));
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
      toast.error("Choose a date and time first.");
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
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h1>
          You’re on the
          <br />
          <em>calendar.</em>
        </h1>
        <div className="confirmation-details">
          <p>{displayDate}</p>
          <p>{labels[confirmation.time]}</p>
        </div>
        <p>
          Your session is pending confirmation. We’ll send an email once it’s
          approved.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setConfirmation(null);
            setSelected(undefined);
            setForm(emptyForm);
          }}
          data-testid="book-another"
        >
          Book another session
        </Button>
      </section>
    );
  }

  return (
    <section className="booking-page page-section">
      <div className="booking-intro">
        <p className="eyebrow">BOOK A SESSION</p>
        <h1>
          Make time for
          <br />
          <em>your next level.</em>
        </h1>
        <p>
          Choose a date, select an available training time, and tell us where
          you want to focus.
        </p>
      </div>

      <form className="booking-form" onSubmit={submit}>
        <section className="booking-step">
          <div className="step-label">
            <span>01</span>
            <h2>Date</h2>
          </div>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={{ before: new Date() }}
            data-testid="booking-calendar"
          />
        </section>

        <section className="booking-step">
          <div className="step-label">
            <span>02</span>
            <h2>Time</h2>
          </div>
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
        </section>

        <section className="booking-step">
          <div className="step-label">
            <span>03</span>
            <h2>About you</h2>
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
              Training focus
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
            <label className="full-field">
              Notes <span>(optional)</span>
              <textarea
                name="notes"
                rows="4"
                value={form.notes}
                onChange={updateField}
                data-testid="booking-notes"
              />
            </label>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            data-testid="submit-booking"
          >
            {submitting ? "Submitting..." : "Request session"}
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

