import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const inPersonPlans = [
  {
    name: "Kickstart",
    tier: "Tier 1",
    price: "$150",
    cadence: "/month",
    audience:
      "Best for beginners building the habit or people with an active lifestyle who need structured strength work.",
    sessions: "1 private 1-on-1 session per week",
    total: "8 total per month",
    perksTitle: "Perks",
    perks: [
      "Basic form analysis and movement screen during week one.",
      "Monthly progress tracking for body composition or performance milestones.",
    ],
  },
  {
    name: "Transformation",
    tier: "Tier 2",
    price: "$250",
    cadence: "/month",
    featured: true,
    audience:
      "Best for specific body composition or performance goals with steady momentum and higher accountability.",
    sessions: "2 private 1-on-1 sessions per week",
    total: "12 total per month",
    perksTitle: "Added perks",
    perks: [
      "Everything in Tier 1.",
      "Off-day programming with a customized monthly training plan tailored to your goals.",
    ],
  },
  {
    name: "Elite Performance",
    tier: "Tier 3",
    price: "$325",
    cadence: "/month",
    audience:
      "Best for athletes, busy executives, or anyone looking for complete lifestyle optimization.",
    sessions: "3 private 1-on-1 sessions per week",
    total: "16 total per month",
    perksTitle: "Premium perks",
    perks: [
      "Everything in Tiers 1 and 2.",
      "Weekly text support with direct coach access for form checks or quick lifestyle questions.",
    ],
  },
];

const onlinePlan = {
  name: "Online Coaching",
  price: "$50",
  cadence: "/month",
  audience:
    "Remote coaching for athletes and active clients who want expert input on their current training and a clearer path forward.",
  sessions: "1 private, 30-minute live video session per week",
  total: "4 total per month",
  perksTitle: "Perks",
  perks: [
    "Initial online assessment.",
    "Personalized workout program.",
  ],
};

function PlanCard({ plan }) {
  return (
    <article className={plan.featured ? "pricing-card featured" : "pricing-card"}>
      {plan.featured && <p className="pricing-badge">Most Popular</p>}
      <p className="eyebrow">{plan.tier || "Remote Plan"}</p>
      <h2>{plan.name}</h2>
      <div className="pricing-rate">
        <span>{plan.price}</span>
        <small>{plan.cadence}</small>
      </div>
      <p className="pricing-audience">{plan.audience}</p>

      <div className="pricing-detail">
        <p className="eyebrow">Coaching</p>
        <strong>{plan.sessions}</strong>
        <span>{plan.total}</span>
      </div>

      <div className="pricing-perks">
        <p className="eyebrow">{plan.perksTitle}</p>
        <ul>
          {plan.perks.map((perk) => (
            <li key={perk}>
              <Check size={15} />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link className="pricing-action" to="/book">
        Book this plan <ArrowRight size={16} />
      </Link>
    </article>
  );
}

export function Pricing() {
  const [mode, setMode] = useState("in-person");
  const plans = mode === "in-person" ? inPersonPlans : [onlinePlan];

  return (
    <section className="pricing-page page-section">
      <div className="pricing-hero">
        <p className="eyebrow">PRICING</p>
        <h1>
          Choose your
          <br />
          <em>progression.</em>
        </h1>
        <p>
          Select the coaching format that fits your schedule, goals, and level
          of accountability.
        </p>
      </div>

      <div className="pricing-switch" aria-label="Pricing type">
        <button
          type="button"
          className={mode === "in-person" ? "active" : ""}
          onClick={() => setMode("in-person")}
          data-testid="pricing-in-person"
        >
          In-Person
        </button>
        <button
          type="button"
          className={mode === "online" ? "active" : ""}
          onClick={() => setMode("online")}
          data-testid="pricing-online"
        >
          Online Coaching
        </button>
      </div>

      <div className={mode === "online" ? "pricing-grid single" : "pricing-grid"}>
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
