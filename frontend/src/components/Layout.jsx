import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home", testId: "home" },
  { to: "/about", label: "About", testId: "about" },
  {
    to: "/in-person-training",
    label: "In-Person Training",
    testId: "in-person-training",
  },
  {
    to: "/online-coaching",
    label: "Online Coaching",
    testId: "online-coaching",
  },
];

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" data-testid="header-logo">
          <span>REACH</span>
          <small>Fitness</small>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(({ to, label, testId }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`nav-${testId}`}
            >
              {label}
            </NavLink>
          ))}
          <Link
            className="nav-cta"
            to="/book"
            data-testid="nav-book-session"
          >
            Book a session
          </Link>
        </nav>
        <button
          className="menu-button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(({ to, label, testId }) => (
              <NavLink
                key={to}
                to={to}
                data-testid={`mobile-nav-${testId}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <p className="eyebrow">Resistance · Endurance · Aerobics</p>
          <p className="footer-name">REACH Fitness</p>
        </div>
        <div className="footer-meta">
          <p>Conditioning · Health</p>
          <Link to="/login" data-testid="footer-admin-login">
            Admin
          </Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} REACH Fitness</p>
      </footer>
    </div>
  );
}
