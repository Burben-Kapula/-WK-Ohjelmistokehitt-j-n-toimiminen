import "../styles/fonts.css";
import "../App.css";

import logo from "../assets/logo/Logo.svg";
import { useRef, useEffect, useState } from "react";
import api from "../api";

export default function LandingPage() {
  const targetRef = useRef(null);
  const orderRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [posts, setPosts] = useState([]);
  const [activePostIndex, setActivePostIndex] = useState(0);

  // Завантажуємо публікації з бекенду для динамічної галереї
  useEffect(() => {
    api.get("/posts")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery posts:", err);
      });
  }, []);

  const mainPost = posts.length > 0 ? (posts[activePostIndex] || posts[0]) : null;

  /* =========================
     SCROLL TO INFO
     ========================= */

  const scrollToElement = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================
     OPEN ORDER FORM
     ========================= */

  const openOrderForm = () => {
    setIsOrderOpen(true);
    setIsSubmitted(false);

    setTimeout(() => {
      orderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  /* =========================
     SCROLL BUTTON
     ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================
     SCROLL TO TOP
     ========================= */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     SUBMIT ORDER
     ========================= */

  const handleOrderSubmit = (event) => {
    event.preventDefault();

    setIsSubmitted(true);

    setTimeout(() => {
      orderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="page">

      {/* =========================
          HEADER
          ========================= */}

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
            aria-label="Takaisin ylös"
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

        <button
          className="cta-button"
          onClick={openOrderForm}
        >
          TILAA VEISTOS
          <span>→</span>
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


          {/* =========================
              GALLERY
              ========================= */}

          <div className="gallery-placeholder">

            <div className="gallery-main-image">
              {mainPost?.imageUrl ? (
                <>
                  <img
                    src={mainPost.imageUrl}
                    alt={mainPost.title}
                    className="gallery-main-img"
                  />
                  <div className="gallery-main-overlay">
                    <div className="gallery-main-badge">
                      {activePostIndex === 0 ? "PÄÄVEISTOS" : `VEISTOS ${String(activePostIndex + 1).padStart(2, "0")}`}
                    </div>
                    <div className="gallery-main-title">
                      {mainPost.title}
                    </div>
                    {mainPost.description && (
                      <div className="gallery-main-desc">
                        {mainPost.description}
                      </div>
                    )}
                  </div>

                  {/* ── NAVIGATION ARROWS ── */}
                  {posts.length > 1 && (
                    <>
                      <button
                        className="gallery-arrow gallery-arrow--prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePostIndex((prev) =>
                            prev === 0 ? posts.length - 1 : prev - 1
                          );
                        }}
                        aria-label="Edellinen kuva"
                      >
                        ←
                      </button>

                      <button
                        className="gallery-arrow gallery-arrow--next"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePostIndex((prev) =>
                            prev === posts.length - 1 ? 0 : prev + 1
                          );
                        }}
                        aria-label="Seuraava kuva"
                      >
                        →
                      </button>

                      {/* dot indicators */}
                      <div className="gallery-dots">
                        {posts.map((_, i) => (
                          <button
                            key={i}
                            className={`gallery-dot${i === activePostIndex ? " active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePostIndex(i);
                            }}
                            aria-label={`Kuva ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="image-caption">
                    KUVA TÄHÄN
                  </div>

                  <div className="image-subcaption">
                    Veistoksen pääkuva
                  </div>
                </>
              )}
            </div>


            <div className="gallery-list">
              {posts.length > 1 ? (
                posts.slice(1).map((post, idx) => {
                  const itemIndex = idx + 1;
                  const itemNumber = String(itemIndex + 1).padStart(2, "0");
                  return (
                    <GalleryItem
                      key={post.id || itemIndex}
                      number={itemNumber}
                      label={post.title || `Veistos ${itemNumber}`}
                      sub={post.description ? (post.description.length > 45 ? `${post.description.slice(0, 45)}...` : post.description) : "Seuraava työ"}
                      image={post.imageUrl}
                      isActive={activePostIndex === itemIndex}
                      onClick={() => setActivePostIndex(itemIndex)}
                    />
                  );
                })
              ) : (
                <>
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
                </>
              )}

              <div
                className="gallery-scroll-hint"
                onClick={scrollToElement}
              >
                <div>
                  <div className="gallery-scroll-title">
                    GALLERIAN SELAUS
                  </div>

                  <div className="gallery-scroll-text">
                    Vieritä lisää töitä
                  </div>
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


          <button
            className="cta-banner-button"
            onClick={openOrderForm}
          >
            TEE TILAUS
            <span>→</span>
          </button>

        </section>


        {/* =====================================================
            ORDER FORM
            ===================================================== */}

        {isOrderOpen && (

          <section
            ref={orderRef}
            className="order-form-section"
          >

            <div className="order-form">

              {/* =========================
                  FORM LEFT SIDE
                  ========================= */}

              <div className="order-form-info">

                <div className="order-form-label">
                  TILAUSLOMAKE
                </div>

                <h2 className="order-form-title">
                  Kerro toiveistasi,
                  <br />
                  me toteutamme sen.
                </h2>

                <p className="order-form-description">
                  Täytä lomake mahdollisimman tarkasti.
                  Kerro millaisen veistoksen haluaisit
                  ja jätä yhteystietosi.
                </p>


                <div className="order-form-benefits">

                  <div className="order-benefit">

                    <div className="order-benefit-icon">
                      ✓
                    </div>

                    <div>
                      <strong>
                        Turvallinen ja luottamuksellinen
                      </strong>

                      <span>
                        tietosi ovat turvassa
                      </span>
                    </div>

                  </div>


                  <div className="order-benefit">

                    <div className="order-benefit-icon">
                      2
                    </div>

                    <div>
                      <strong>
                        Vastaus 2 arkipäivän kuluessa
                      </strong>

                      <span>
                        käsittelemme jokaisen tilauksen
                      </span>
                    </div>

                  </div>


                  <div className="order-benefit">

                    <div className="order-benefit-icon">
                      ✓
                    </div>

                    <div>
                      <strong>
                        Ei sitoumuksia
                      </strong>

                      <span>
                        kartoitamme ensin toiveesi
                      </span>
                    </div>

                  </div>

                </div>

              </div>


              {/* =========================
                  FORM / SUCCESS
                  ========================= */}

              {!isSubmitted ? (

                <form
                  className="order-form-fields"
                  onSubmit={handleOrderSubmit}
                >

                  {/* NAME */}

                  <div className="order-form-row">

                    <div className="order-field">

                      <label htmlFor="firstName">
                        Etunimi *
                      </label>

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Etunimi"
                        required
                      />

                    </div>


                    <div className="order-field">

                      <label htmlFor="lastName">
                        Sukunimi *
                      </label>

                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Sukunimi"
                        required
                      />

                    </div>

                  </div>


                  {/* EMAIL */}

                  <div className="order-field">

                    <label htmlFor="email">
                      Sähköposti *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="esimerkki@email.com"
                      required
                    />

                  </div>


                  {/* PHONE */}

                  <div className="order-field">

                    <label htmlFor="phone">
                      Puhelinnumero *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="040 123 4567"
                      required
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div className="order-field">

                    <label htmlFor="description">
                      Millaisen veistoksen haluaisit? *
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows="6"
                      placeholder="Kerro esimerkiksi eläimestä, koosta, materiaalista, tyylistä, väristä tai muista toiveistasi..."
                      required
                    />

                  </div>


                  {/* FILE UPLOAD */}

                  <div className="order-field">

                    <label htmlFor="files">
                      Kuvat tai suunnitelmat
                      <span className="optional">
                        valinnainen
                      </span>
                    </label>


                    <label
                      htmlFor="files"
                      className="order-upload"
                    >

                      <div className="order-upload-icon">
                        ↑
                      </div>

                      <div className="order-upload-text">

                        <strong>
                          Lisää kuvia tai suunnitelmia
                        </strong>

                        <span>
                          PNG, JPG tai PDF · max. 10 MB
                        </span>

                      </div>

                      <input
                        id="files"
                        name="files"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        multiple
                      />

                    </label>

                  </div>


                  {/* BOTTOM */}

                  <div className="order-form-bottom">

                    <label className="order-checkbox">

                      <input
                        type="checkbox"
                        required
                      />

                      <span>
                        Hyväksyn, että minuun otetaan
                        yhteyttä tilaukseen liittyen.
                      </span>

                    </label>


                    <button
                      type="submit"
                      className="order-submit"
                    >
                      LÄHETÄ TILAUS
                      <span>→</span>
                    </button>

                  </div>

                </form>

              ) : (

                /* =========================
                   SUCCESS MESSAGE
                   ========================= */

                <div className="order-success">

                  <div className="order-success-icon">
                    ✓
                  </div>

                  <div>

                    <div className="order-success-label">
                      TILAUS VASTAANOTETTU
                    </div>

                    <h3>
                      Kiitos tilauksestasi!
                    </h3>

                    <p>
                      Tilauksesi on vastaanotettu ja
                      välitetään sähköpostiimme käsiteltäväksi.
                      Tarkistamme toiveesi ja otamme sinuun
                      yhteyttä 2 arkipäivän kuluessa.
                    </p>

                    <p className="order-success-note">
                      Voit olla rauhallisin mielin —
                      tilauksesi ei mennyt hukkaan.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </section>

        )}


        {/* =====================================================
            TIETOA
            ===================================================== */}

        <section
          ref={targetRef}
          className="tietoa"
          id="tietoa"
        >

          <div className="tietoa__inner">

            <div className="tietoa__label">
              TIETOA
            </div>


            <div className="tietoa__content">

              <h2>
                Käsin tehty veistos, joka kestää aikaa.
              </h2>

              <p>
                Jokainen veistos valmistetaan käsityönä Suomessa.
                Veistoksen perustana on kestävä metallirunko, jonka
                ympärille veistos rakennetaan betonista. Muoto,
                yksityiskohdat ja viimeistely tehdään käsin, joten
                jokainen veistos on oma yksilönsä.
              </p>

              <p>
                Betoni tekee veistoksesta vahvan ja sopivan myös
                ulkokäyttöön. Oikein valmistettuna ja sijoitettuna
                veistos kestää Suomen vaihtelevia sääolosuhteita ja
                säilyy kauniina pitkään.
              </p>

              <p>
                Galleria esittelee esimerkkejä valmiista veistoksista
                ja näyttää, millaisia töitä voidaan toteuttaa. Oman
                veistoksen voi suunnitella yhdessä tekijän kanssa –
                eläimen, koon ja yksityiskohtien lisäksi myös{" "}
                <strong>värin voi valita</strong>.
              </p>

              <p>
                Kaikki veistokset suunnitellaan ja valmistetaan{" "}
                <strong>Suomessa.</strong>
              </p>


              <div className="tietoa__cta">

                <strong>
                  Oma idea mielessä?
                </strong>

                <span>
                  Kerro meille toiveesi, niin suunnitellaan siitä
                  oma veistos.
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   GALLERY ITEM
   ===================================================== */

function GalleryItem({
  number,
  label,
  sub,
  image,
  onClick,
  isActive,
}) {
  return (
    <div
      className={`gallery-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="gallery-item-image">
        {image ? (
          <img
            src={image}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              color: "#9aa2ad",
              fontWeight: 700,
            }}
          >
            {number}
          </div>
        )}
      </div>

      <div className="gallery-item-content">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="gallery-item-title">
            {label}
          </div>

          <div className="gallery-item-sub">
            {sub}
          </div>
        </div>

        <div className="gallery-item-arrow">
          →
        </div>
      </div>
    </div>
  );
}


/* =====================================================
   STEP CARD
   ===================================================== */

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


/* =====================================================
   PROCESS STEP
   ===================================================== */

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

      <div>

        <div className="process-step-title">
          {title}
        </div>

        <div className="process-step-desc">
          {desc}
        </div>

      </div>

      <div className="process-step-line" />

    </div>
  );
}
