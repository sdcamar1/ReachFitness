import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function OnlineCoaching() {
  return (
    <section className="service-page page-section">
      <div className="service-hero">
        <p className="eyebrow">ONLINE COACHING</p>
        <h1>
          Guidance for
          <br />
          <em>where you train.</em>
        </h1>
        <p>
          Remote coaching for athletes and active clients who want expert input
          on their current training and a clearer path forward.
        </p>
      </div>

      <div className="service-layout">
        <div className="service-lede">
          <figure className="service-image">
            <img
              src="/images/online-coaching.jpeg"
              alt="Client following an online coaching workout from home"
            />
          </figure>
          <p>
            Online coaching sessions are collaborative. We look at your current
            workout regimen, talk through what is working, identify potential
            room for improvement, and create a plan that supports your goals
            wherever you train.
          </p>
          <Link
            className="text-link"
            to="/book"
            data-testid="online-coaching-book"
          >
            Book online coaching <ArrowRight size={18} />
          </Link>
        </div>

        <div className="service-points">
          <article>
            <span>01</span>
            <h2>Training review</h2>
            <p>
              Bring your current program, questions, recent progress, and
              sticking points so the coaching starts with the work you are
              already doing.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Room to improve</h2>
            <p>
              Sessions focus on practical adjustments to exercise selection,
              volume, intensity, progression, and recovery.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Research-backed plans</h2>
            <p>
              Online clients get access to current workout programming informed
              by peer-reviewed strength and conditioning research.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
