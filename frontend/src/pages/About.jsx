import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export const fallbackAbout = {
  name: "Rose Copes",
  title: "Founder · REACH Fitness",
  bio: "Rose Copes brings the perspective of an NCAA Division I athlete at Grand Canyon University to every coaching relationship.\n\nNow a Doctor of Physical Therapy student at Rockhurst University, Rose connects performance with movement, recovery, and long-term health.",
  quote: "Your goals are within reach. Let's build the foundation to get you there.",
  image_url: "/images/coach-portrait.png",
  credentials: [
    "BS in Biology",
    "NSCA CSCS Certified",
    "Division I NCAA Athlete",
  ],
};

export function AboutPreview({ content, compact = false }) {
  const paragraphs = content.bio.split(/\n\s*\n/).filter(Boolean);
  return (
    <div className={compact ? "about-preview compact" : "about-layout"}>
      <figure className="about-portrait">
        <img src={content.image_url} alt={content.name} />
        <figcaption className="eyebrow">FOUNDER · COACH · ATHLETE</figcaption>
      </figure>
      <div className="about-copy">
        <p className="eyebrow">{compact ? "LIVE PREVIEW" : "01 · ABOUT"}</p>
        <h1>{content.name}</h1>
        <p className="about-title">{content.title}</p>
        <blockquote>{content.quote}</blockquote>
        <div className="bio-copy">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="credentials">
          <p className="eyebrow">CREDENTIALS</p>
          {content.credentials.map((credential, index) => (
            <div key={`${credential}-${index}`}>
              <span>0{index + 1}</span>
              <p>{credential}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function About() {
  const [content, setContent] = useState(fallbackAbout);

  useEffect(() => {
    api("/about").then(setContent).catch(() => {});
  }, []);

  return (
    <section className="page-section about-page">
      <AboutPreview content={content} />
      <div className="about-cta">
        <p className="eyebrow">READY TO BEGIN?</p>
        <Link className="text-link" to="/book" data-testid="about-book">
          Book your session <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

