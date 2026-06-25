import React, { useEffect, useState } from "react";
import { Check, LogOut, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { api, clearAuthToken } from "../lib/api";
import { AboutPreview, cacheAboutContent, fallbackAbout } from "./About";

const filters = ["all", "pending", "confirmed", "cancelled"];

export function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("appointments");
  const [filter, setFilter] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [about, setAbout] = useState(fallbackAbout);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadAppointments(nextFilter = filter) {
    const query = nextFilter === "all" ? "" : `?status=${nextFilter}`;
    const data = await api(`/appointments${query}`);
    setAppointments(data);
  }

  useEffect(() => {
    async function load() {
      try {
        await api("/auth/me");
      } catch (error) {
        if (error.status === 401) {
          navigate("/login");
          return;
        }
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      try {
        const appointmentData = await api("/appointments");
        setAppointments(appointmentData);
      } catch (error) {
        setLoadError(error.message);
        toast.error(`Appointments could not load: ${error.message}`);
      }

      try {
        const aboutData = await api("/about");
        setAbout(aboutData);
      } catch (error) {
        setLoadError(error.message);
        toast.error(`About content could not load: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  async function changeFilter(nextFilter) {
    setFilter(nextFilter);
    try {
      await loadAppointments(nextFilter);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function setStatus(id, status) {
    try {
      await api(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadAppointments();
      toast.success(`Appointment ${status}.`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function removeAppointment(id) {
    if (!window.confirm("Delete this appointment permanently?")) return;
    try {
      await api(`/appointments/${id}`, { method: "DELETE" });
      await loadAppointments();
      toast.success("Appointment deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function saveAbout(event) {
    event.preventDefault();
    try {
      const saved = await api("/about", {
        method: "PUT",
        body: JSON.stringify(about),
      });
      setAbout(saved);
      cacheAboutContent(saved);
      toast.success("About page saved.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    clearAuthToken();
    navigate("/");
  }

  if (loading) return <div className="admin-loading">Loading studio...</div>;

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">REACH FITNESS</p>
          <h1>Studio dashboard</h1>
        </div>
        <Button variant="quiet" onClick={logout} data-testid="admin-logout">
          <LogOut size={16} /> Sign out
        </Button>
      </header>

      <div className="admin-tabs">
        <button
          className={tab === "appointments" ? "active" : ""}
          onClick={() => setTab("appointments")}
          data-testid="admin-tab-appointments"
        >
          Appointments
        </button>
        <button
          className={tab === "about" ? "active" : ""}
          onClick={() => setTab("about")}
          data-testid="admin-tab-about"
        >
          About
        </button>
      </div>

      {loadError && (
        <p className="empty-state" role="alert">
          Dashboard data could not fully load: {loadError}
        </p>
      )}

      {tab === "appointments" ? (
        <div className="appointments-panel">
          <div className="filter-row">
            {filters.map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => changeFilter(item)}
                data-testid={`filter-${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="appointment-list">
            {appointments.length === 0 && (
              <p className="empty-state">No appointments in this view.</p>
            )}
            {appointments.map((appointment) => (
              <article className="appointment-row" key={appointment.id}>
                <div className="appointment-date">
                  <strong>{appointment.date}</strong>
                  <span>{appointment.time}</span>
                </div>
                <div>
                  <h2>{appointment.name}</h2>
                  <p>{appointment.email}</p>
                  <p>{appointment.phone}</p>
                </div>
                <div>
                  <p className="eyebrow">SESSION</p>
                  <p>{appointment.service_type || "In-Person Training"}</p>
                  {appointment.time !== "Pending" && !appointment.commitment && (
                    <p>{appointment.duration || "60 Minutes"}</p>
                  )}
                  <p className="eyebrow">FOCUS</p>
                  <p>{appointment.focus}</p>
                  {appointment.commitment && <p>{appointment.commitment}</p>}
                  {appointment.contact_preference && (
                    <p>Prefers {appointment.contact_preference}</p>
                  )}
                  {appointment.obstacle && (
                    <p className="notes">Obstacle: {appointment.obstacle}</p>
                  )}
                  {appointment.promotion_code && (
                    <p className="notes">Promo: {appointment.promotion_code}</p>
                  )}
                  {appointment.notes && <p className="notes">{appointment.notes}</p>}
                </div>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
                <div className="appointment-actions">
                  {appointment.status !== "confirmed" && (
                    <button
                      aria-label="Confirm appointment"
                      onClick={() => setStatus(appointment.id, "confirmed")}
                      data-testid={`confirm-${appointment.id}`}
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {appointment.status !== "cancelled" && (
                    <button
                      aria-label="Cancel appointment"
                      onClick={() => setStatus(appointment.id, "cancelled")}
                      data-testid={`cancel-${appointment.id}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    aria-label="Delete appointment"
                    onClick={() => removeAppointment(appointment.id)}
                    data-testid={`delete-${appointment.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="about-admin">
          <form className="about-editor" onSubmit={saveAbout}>
            <label>
              Name
              <input
                value={about.name}
                onChange={(event) =>
                  setAbout({ ...about, name: event.target.value })
                }
                data-testid="about-name"
              />
            </label>
            <label>
              Title
              <input
                value={about.title}
                onChange={(event) =>
                  setAbout({ ...about, title: event.target.value })
                }
                data-testid="about-title"
              />
            </label>
            <label>
              Image URL
              <input
                value={about.image_url}
                onChange={(event) =>
                  setAbout({ ...about, image_url: event.target.value })
                }
                data-testid="about-image"
              />
            </label>
            <label>
              Pull quote
              <textarea
                rows="3"
                value={about.quote}
                onChange={(event) =>
                  setAbout({ ...about, quote: event.target.value })
                }
                data-testid="about-quote"
              />
            </label>
            <label>
              Bio
              <textarea
                rows="12"
                value={about.bio}
                onChange={(event) =>
                  setAbout({ ...about, bio: event.target.value })
                }
                data-testid="about-bio"
              />
            </label>
            <fieldset>
              <legend>Credentials</legend>
              {about.credentials.map((credential, index) => (
                <div className="credential-field" key={index}>
                  <input
                    value={credential}
                    onChange={(event) => {
                      const credentials = [...about.credentials];
                      credentials[index] = event.target.value;
                      setAbout({ ...about, credentials });
                    }}
                    data-testid={`credential-${index}`}
                  />
                  <button
                    type="button"
                    aria-label="Remove credential"
                    onClick={() =>
                      setAbout({
                        ...about,
                        credentials: about.credentials.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      })
                    }
                    data-testid={`remove-credential-${index}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                className="add-credential"
                type="button"
                onClick={() =>
                  setAbout({
                    ...about,
                    credentials: [...about.credentials, ""],
                  })
                }
                data-testid="add-credential"
              >
                <Plus size={16} /> Add credential
              </button>
            </fieldset>
            <Button type="submit" data-testid="save-about">
              Save about page
            </Button>
          </form>
          <div className="preview-pane">
            <AboutPreview content={about} compact />
          </div>
        </div>
      )}
    </section>
  );
}
