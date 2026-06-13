import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function InPersonTraining() {
  return (
    <section className="service-page page-section">
      <div className="service-hero">
        <p className="eyebrow">IN-PERSON TRAINING</p>
        <h1>
          Built around
          <br />
          <em>how you move.</em>
        </h1>
        <p>
          A hands-on training experience for strength, body composition, and
          athletic development with a plan that adapts to your goals.
        </p>
      </div>

      <div className="service-layout">
        <div className="service-lede">
          <figure className="service-image">
            <img
              src="/images/training-action.png"
              alt="Coach guiding an in-person strength training session"
            />
          </figure>
        </div>

        <div className="service-points">
          <article>
            <span>01</span>
            <h2>Personalized programming</h2>
            <p>
              Training is shaped around your goals, schedule, movement history,
              and readiness so your workouts are challenging without becoming
              careless.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Research-led methods</h2>
            <p>
              Programs draw from current strength and conditioning research and
              best practices aligned with NSCA standards.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Injury prevention</h2>
            <p>
              Coaching emphasizes sound technique, appropriate loading, recovery,
              and long-term durability so progress does not come at the expense
              of your health.
            </p>
          </article>
        </div>

        <div className="service-summary">
          <p>
            In-person training starts with a personalized workout program based
            on what you want to improve: strength training, weight loss, or
            athletic performance. Each session gives you direct coaching,
            movement feedback, and progression that fits your current ability.
          </p>
        </div>

        <div className="service-cta">
          <p className="eyebrow">READY TO TRAIN?</p>
          <Link
            className="text-link"
            to="/book"
            data-testid="in-person-book"
          >
            Book in-person training <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
