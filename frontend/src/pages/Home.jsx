import React from "react";
import { ArrowDownRight, ArrowRight, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const disciplines = [
  ["R", "Resistance", "Build strength that transfers beyond the weight room."],
  ["E", "Endurance", "Build the stamina to sustain effort and recover well."],
  [
    "A",
    "Aerobics",
    "Train the cardiovascular base that supports daily life and performance.",
  ],
  ["C", "Conditioning", "Create the capacity to perform, adapt, and endure."],
  ["H", "Health", "Train for a strong body and a sustainable life."],
];

export function Home() {
  return (
    <>
      <section className="hero section-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow">VOL. 01 · COACHING STUDIO</p>
          <h1>
            Train the
            <br />
            whole <em>athlete.</em>
          </h1>
          <p className="hero-intro">
            Resistance, endurance, aerobics, conditioning, and health.
            Five disciplines, shaped into one personal practice.
          </p>
          <Link className="button link-button" to="/book" data-testid="hero-book">
            Book a session <ArrowDownRight size={18} />
          </Link>
          <div className="home-socials" aria-label="REACH Fitness social media">
            <span className="eyebrow">FOLLOW REACH</span>
            <a
              href="https://www.instagram.com/reachfitnesskc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              aria-label="REACH Fitness on Instagram"
              title="Instagram"
              data-testid="home-instagram"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://www.facebook.com/share/1Pqe1LbQ2m/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="REACH Fitness on Facebook"
              title="Facebook"
              data-testid="home-facebook"
            >
              <Facebook size={17} />
            </a>
          </div>
        </div>
        <figure className="hero-image-wrap reveal reveal-delay">
          <img
            src="/images/home-page.jpg"
            alt="Athlete standing on a rocky overlook above the coast"
          />
          <figcaption>
            <span>01</span>
            <span>Strength with intention.</span>
          </figcaption>
        </figure>
      </section>

      <section className="disciplines page-section">
        <div className="section-heading">
          <p className="eyebrow">01 · THE PRACTICE</p>
          <h2>
            Five disciplines,
            <br />
            one <em>practice.</em>
          </h2>
        </div>
        <div className="discipline-list">
          {disciplines.map(([letter, name, description], index) => (
            <article className="discipline-row" key={letter}>
              <span className="discipline-index">0{index + 1}</span>
              <span className="discipline-letter">{letter}</span>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <p className="eyebrow">THE REACH METHOD</p>
        <blockquote>
          “<span className="manifesto-accent">Fitness</span> is not one
          quality. It is a{" "}
          <span className="manifesto-accent">relationship</span> between{" "}
          <span className="manifesto-accent">multiple factors</span> that
          underlie a person's physical health.”
        </blockquote>
        <Link to="/about" data-testid="manifesto-about">
          Meet your coach <ArrowRight size={16} />
        </Link>
      </section>

      <section className="editorial-images page-section">
        <figure className="image-feature image-feature-wide">
          <img src="/images/training-action.png" alt="Athlete barbell training" />
          <figcaption>
            <span className="eyebrow">02 · BUILD CAPACITY</span>
            <p>Purpose in every repetition.</p>
          </figcaption>
        </figure>
        <figure className="image-feature image-feature-small">
          <img src="/images/training-detail.png" alt="Coach preparing an athlete" />
          <figcaption>
            <span className="eyebrow">03 · TOTAL HEALTH</span>
            <p>Details shape the outcome.</p>
          </figcaption>
        </figure>
      </section>

      <section className="closing-cta page-section">
        <p className="eyebrow">START WHERE YOU ARE</p>
        <h2>
          Your next level is
          <br />
          <em>within reach.</em>
        </h2>
        <Link className="button link-button" to="/book" data-testid="closing-book">
          Book a session <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
