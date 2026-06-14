import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export const fallbackAbout = {
  name: "Rose Copes",
  title: "Founder · REACH Fitness",
  bio: "Rose Copes brings the perspective of an NCAA Division I athlete at Grand Canyon University to every coaching relationship.\n\nNow a Doctor of Physical Therapy student at Rockhurst University, Rose connects performance with movement, recovery, and long-term health.",
  quote: "Your goals are within reach. Let's build the foundation to get you there.",
  image_url: "/images/rose-profile.jpg",
  credentials: [
    "BS in Biology",
    "NSCA CSCS Certified",
    "Division I NCAA Athlete",
  ],
};

const aboutCacheKey = "reach-about-content";

function readCachedAbout() {
  if (typeof window === "undefined") return fallbackAbout;
  try {
    const cached = window.localStorage.getItem(aboutCacheKey);
    return cached ? JSON.parse(cached) : fallbackAbout;
  } catch {
    return fallbackAbout;
  }
}

export function cacheAboutContent(content) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(aboutCacheKey, JSON.stringify(content));
  } catch {
    // Ignore storage failures so the public page can still render.
  }
}

function renderBioBlock(block, blockIndex) {
  const lines = block.split("\n").filter((line) => line.trim());
  const elements = [];
  let paragraphLines = [];
  let bulletItems = [];

  function flushParagraph() {
    if (!paragraphLines.length) return;
    elements.push(
      <p key={`bio-paragraph-${blockIndex}-${elements.length}`}>
        {paragraphLines.join(" ")}
      </p>,
    );
    paragraphLines = [];
  }

  function flushBullets() {
    if (!bulletItems.length) return;
    elements.push(
      <ul key={`bio-list-${blockIndex}-${elements.length}`}>
        {bulletItems.map((item, itemIndex) => (
          <li key={`${item}-${itemIndex}`}>{item}</li>
        ))}
      </ul>,
    );
    bulletItems = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("-")) {
      flushParagraph();
      bulletItems.push(trimmed.replace(/^-\s*/, ""));
      return;
    }
    flushBullets();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushBullets();

  return (
    <React.Fragment key={`bio-block-${blockIndex}`}>{elements}</React.Fragment>
  );
}

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
          {paragraphs.map(renderBioBlock)}
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
        {!compact && (
          <section className="certification-panel">
            <p className="eyebrow">CSCS CERTIFICATION</p>
            <h2>Why CSCS is a higher training standard</h2>
            <p>
              Certified Strength and Conditioning Specialist credentials are
              built for advanced human performance, athletic development, and
              injury-conscious programming. Compared with a standard CPT, the
              CSCS requires a bachelor's degree or qualifying enrollment, a more
              technical exam, and a narrower professional scope centered on
              strength, conditioning, biomechanics, and periodized training.
            </p>

            <div className="certification-table">
              <div className="certification-row header">
                <span>Feature</span>
                <span>Standard CPT</span>
                <span>NSCA CSCS</span>
              </div>
              <div className="certification-row">
                <span>Prerequisites</span>
                <span>High school diploma or GED.</span>
                <span>
                  Bachelor's degree, often in a science or healthcare field, or
                  qualifying enrollment as a chiropractic or medical student.
                </span>
              </div>
              <div className="certification-row">
                <span>Primary scope</span>
                <span>
                  General fitness, introductory weight loss, and exercise
                  instruction for healthy populations.
                </span>
                <span>
                  Advanced human performance, athletic development, complex
                  biomechanics, and targeted injury prevention.
                </span>
              </div>
              <div className="certification-row">
                <span>Exam complexity</span>
                <span>
                  Foundational gym safety, basic programming, and client workout
                  tracking.
                </span>
                <span>
                  Two technical sections covering exercise science, nutrition,
                  program design, testing, evaluation, and organization.
                </span>
              </div>
              <div className="certification-row">
                <span>Approx. pass rate</span>
                <span>~77% pass rate for many standard CPT exams.</span>
                <span>
                  ~50% CSCS pass rate, with first-time pass rates historically
                  reported around 38% to 50%.
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function About() {
  const [content, setContent] = useState(readCachedAbout);

  useEffect(() => {
    api("/about")
      .then((nextContent) => {
        setContent(nextContent);
        cacheAboutContent(nextContent);
      })
      .catch(() => {});
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
