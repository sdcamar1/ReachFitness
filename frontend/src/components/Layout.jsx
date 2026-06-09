import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/book", "Book"],
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
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`nav-${label.toLowerCase()}`}
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
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                data-testid={`mobile-nav-${label.toLowerCase()}`}
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
          <p className="eyebrow">Resistance · Enhancement · Athletics</p>
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

