import "./styles/fonts.css";
import "./App.css";

import logo from "./assets/logo/Logo.svg";
import { useRef, useEffect, useState } from "react";

function App() {
  const targetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToElement = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="page">
      <header className="header">
        <img
          src={logo}
          alt="K.BETONIVEISTOKSET"
          className="logo"
        />

        {isVisible && (
          <button
            className="back-to-top"
            onClick={scrollToTop}
          >
            ↑
          </button>
        )}

        <nav className="nav">
          <button
            className="nav-link"
            onClick={scrollToElement}
          >
            Tietoa
          </button>
        </nav>

        <button className="cta-button">
          TILAA VEISTOS →
        </button>
      </header>

      <main className="main">
        {/* =========================
            HERO
            ========================= */}

        <section className="hero">
          <div className="hero-label">
            VEISTOKSIA KOTIIN.
          </div>

          <h1 className="hero-title">
            VEISTOKSIA KOTIIN.
          </h1>

          <p className="hero-desc">
            Eläinveistoksia käsin tehtynä.
            <br />
            Helppo tapa tilata oma veistos.
          </p>

          <div className="gallery-placeholder">
            <div className="gallery-main-image">
              <div className="image-caption">
                KUVA TÄHÄN
              </div>

              <div className="image-subcaption">
                Veistoksen pääkuva
              </div>
            </div>

            <div className="gallery-list">
              <GalleryItem
                number="02"
                label="Veistos 02"
                sub="Seuraava työ"
              />

              <GalleryItem
                number="03"
                label="Veistos 03"
                sub="Seuraava työ"
              />

              <div className="gallery-scroll-hint">
                <div className="gallery-scroll-title">
                  GALLERIAN SELAUS
                </div>

                <div className="gallery-scroll-text">
                  Vieritä lisää töitä
                </div>

                <div className="gallery-scroll-icon">
                  ↓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            ORDER STEPS
            ========================= */}

        <section className="order-steps">
          <h2 className="section-label">
            TILAAMINEN
          </h2>

          <h3 className="section-title">
            Tilaa helposti ilman verkkokauppaa.
          </h3>

          <p className="section-desc">
            Täytä lomake, kerro toiveesi ja jätä
            yhteystietosi.
          </p>

          <div className="steps">
            <StepCard
              number="01"
              title="Valitse"
              desc="tuotteen tiedot"
              variant="light"
            />

            <StepCard
              number="02"
              title="Lähetä"
              desc="tilauslomake"
              variant="light"
            />

            <StepCard
              number="03"
              title="Sovitaan"
              desc="tilauksen yksityiskohdat"
              variant="dark"
            />
          </div>
        </section>

        {/* =========================
            CTA
            ========================= */}

        <section className="cta-banner">
          <div className="cta-banner-text">
            <h3 className="cta-banner-title">
              Haluatko oman veistoksen?
            </h3>

            <p className="cta-banner-desc">
              Lähetä tilaus ja olemme yhteydessä.
            </p>
          </div>

          <button className="cta-banner-button">
            TEE TILAUS →
          </button>
        </section>
      </main>

      {/* =========================
          FOOTER
          ========================= */}

      <footer className="footer">
        <div className="footer-top">
          <div className="process-block">
            <section ref={targetRef}>
              <div className="footer-label">
                TIETOA
              </div>
            </section>

            <h3 className="footer-title">
              Näin työskentelemme.
            </h3>

            <p className="footer-desc">
              Yksinkertainen prosessi alusta valmiiseen
              veistokseen.
            </p>
          </div>

          <div className="company-block">
            <div className="footer-label-light">
              YRITYS
            </div>

            <h4 className="company-name">
              Volodymyr Kapula
            </h4>

            <div className="company-sub">
              Betoniveistokset
            </div>

            <div className="company-divider" />

            <div className="company-info">
              <div className="info-label">
                OSOITE
              </div>

              <div className="info-text">
                Huhtimäentie 307
              </div>

              <div className="info-text">
                77570 Jäppilä, Pieksämäki
              </div>

              <div className="info-label">
                YHTEYS
              </div>

              <div className="info-text">
                045 344 4180
              </div>

              <div className="info-text">
                volodimir.kapula@gmail.com
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <div className="logo-sub">
              BETONIVEISTOKSET
            </div>
          </div>

          <div className="footer-links">
            
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================
   GALLERY ITEM
   ========================= */

function GalleryItem({ number, label, sub }) {
  return (
    <div className="gallery-item">
      <div className="gallery-item-image" />

      <div className="gallery-item-content">
        <div className="gallery-item-title">
          {label}
        </div>

        <div className="gallery-item-sub">
          {sub}
        </div>

        <div className="gallery-item-arrow">
          →
        </div>
      </div>
    </div>
  );
}

/* =========================
   STEP CARD
   ========================= */

function StepCard({
  number,
  title,
  desc,
  variant,
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={`step-card ${
        isDark ? "dark" : "light"
      }`}
    >
      <div
        className={`step-number ${
          isDark ? "light" : "dark"
        }`}
      >
        {number}
      </div>

      <div className="step-title">
        {title}
      </div>

      <div className="step-desc">
        {desc}
      </div>
    </div>
  );
}

/* =========================
   PROCESS STEP
   ========================= */

function ProcessStep({
  number,
  title,
  desc,
  active,
}) {
  return (
    <div className="process-step">
      <div
        className={`process-step-circle ${
          active ? "active" : ""
        }`}
      >
        {number}
      </div>

      <div className="process-step-title">
        {title}
      </div>

      <div className="process-step-desc">
        {desc}
      </div>

      <div className="process-step-line" />
    </div>
  );
}

export default App;