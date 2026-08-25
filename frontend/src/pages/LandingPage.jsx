import { useRef, useEffect, useState } from "react";
import api from "../api";
import "../styles/fonts.css";
import "../App.css";

import logo from "../assets/logo/Logo.svg";

export default function LandingPage() {
  const targetRef = useRef(null);
  const orderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activePostIndex, setActivePostIndex] = useState(0);

  useEffect(() => {
    api.get("/posts")
      .then((res) => Array.isArray(res.data) && setPosts(res.data))
      .catch((err) => console.error("Failed to load gallery posts:", err));
  }, []);

  const mainPost = posts[activePostIndex] || posts[0] || null;

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const openOrderForm = () => {
    setIsOrderOpen(true);
    setIsSubmitted(false);
    setTimeout(() => scrollTo(orderRef), 100);
  };

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => scrollTo(orderRef), 100);
  };

  return (
    <div className="page">
      <header className="header">
        <img src={logo} alt="K.BETONIVEISTOKSET" className="logo" />
        {isVisible && (
          <button className="back-to-top" onClick={scrollToTop} aria-label="Takaisin ylös">↑</button>
        )}
        <nav className="nav">
          <button className="nav-link" onClick={() => scrollTo(targetRef)}>Tietoa</button>
        </nav>
        <button className="cta-button" onClick={openOrderForm}>TILAA VEISTOS<span>→</span></button>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-label">VEISTOKSIA KOTIIN.</div>
          <h1 className="hero-title">VEISTOKSIA KOTIIN.</h1>
          <p className="hero-desc">
            Eläinveistoksia käsin tehtynä.<br />Helppo tapa tilata oma veistos.
          </p>

          <div className="gallery-placeholder">
            <div className="gallery-main-image">
              {mainPost?.imageUrl ? (
                <>
                  <img src={mainPost.imageUrl} alt={mainPost.title} className="gallery-main-img" />
                  <div className="gallery-main-overlay">
                    <div className="gallery-main-badge">
                      {activePostIndex === 0 ? "PÄÄVEISTOS" : `VEISTOS ${String(activePostIndex + 1).padStart(2, "0")}`}
                    </div>
                    <div className="gallery-main-title">{mainPost.title}</div>
                    {mainPost.description && <div className="gallery-main-desc">{mainPost.description}</div>}
                  </div>
                  {posts.length > 1 && (
                    <>
                      <button className="gallery-arrow gallery-arrow--prev" onClick={(e) => { e.stopPropagation(); setActivePostIndex(p => p === 0 ? posts.length - 1 : p - 1); }} aria-label="Edellinen kuva">←</button>
                      <button className="gallery-arrow gallery-arrow--next" onClick={(e) => { e.stopPropagation(); setActivePostIndex(p => p === posts.length - 1 ? 0 : p + 1); }} aria-label="Seuraava kuva">→</button>
                      <div className="gallery-dots">
                        {posts.map((_, i) => (
                          <button key={i} className={`gallery-dot${i === activePostIndex ? " active" : ""}`} onClick={(e) => { e.stopPropagation(); setActivePostIndex(i); }} aria-label={`Kuva ${i + 1}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="image-caption">KUVA TÄHÄN</div>
                  <div className="image-subcaption">Veistoksen pääkuva</div>
                </>
              )}
            </div>

            <div className="gallery-list">
              {posts.length > 1 ? (
                posts.slice(1).map((post, idx) => {
                  const itemIndex = idx + 1;
                  return (
                    <GalleryItem
                      key={post.id || itemIndex}
                      number={String(itemIndex + 1).padStart(2, "0")}
                      label={post.title || `Veistos ${itemIndex + 1}`}
                      sub={post.description ? (post.description.length > 45 ? `${post.description.slice(0, 45)}...` : post.description) : "Seuraava työ"}
                      image={post.imageUrl}
                      isActive={activePostIndex === itemIndex}
                      onClick={() => setActivePostIndex(itemIndex)}
                    />
                  );
                })
              ) : (
                <>
                  <GalleryItem number="02" label="Veistos 02" sub="Seuraava työ" />
                  <GalleryItem number="03" label="Veistos 03" sub="Seuraava työ" />
                </>
              )}
              <div className="gallery-scroll-hint" onClick={() => scrollTo(targetRef)}>
                <div>
                  <div className="gallery-scroll-title">GALLERIAN SELAUS</div>
                  <div className="gallery-scroll-text">Vieritä lisää töitä</div>
                </div>
                <div className="gallery-scroll-icon">↓</div>
              </div>
            </div>
          </div>
        </section>

        <section className="order-steps">
          <h2 className="section-label">TILAAMINEN</h2>
          <h3 className="section-title">Tilaa helposti ilman verkkokauppaa.</h3>
          <p className="section-desc">Täytä lomake, kerro toiveesi ja jätä yhteystietosi.</p>
          <div className="steps">
            <StepCard number="01" title="Valitse" desc="tuotteen tiedot" variant="light" />
            <StepCard number="02" title="Lähetä" desc="tilauslomake" variant="light" />
            <StepCard number="03" title="Sovitaan" desc="tilauksen yksityiskohdat" variant="dark" />
          </div>
        </section>

        <section className="cta-banner">
          <div className="cta-banner-text">
            <h3 className="cta-banner-title">Haluatko oman veistoksen?</h3>
            <p className="cta-banner-desc">Lähetä tilaus ja olemme yhteydessä.</p>
          </div>
          <button className="cta-banner-button" onClick={openOrderForm}>TEE TILAUS<span>→</span></button>
        </section>

        {isOrderOpen && (
          <section ref={orderRef} className="order-form-section">
            <div className="order-form">
              <div className="order-form-info">
                <div className="order-form-label">TILAUSLOMAKE</div>
                <h2 className="order-form-title">Kerro toiveistasi,<br />me toteutamme sen.</h2>
                <p className="order-form-description">Täytä lomake mahdollisimman tarkasti. Kerro millaisen veistoksen haluaisit ja jätä yhteystietosi.</p>
                <div className="order-form-benefits">
                  <div className="order-benefit">
                    <div className="order-benefit-icon">✓</div>
                    <div><strong>Turvallinen ja luottamuksellinen</strong><span>tietosi ovat turvassa</span></div>
                  </div>
                  <div className="order-benefit">
                    <div className="order-benefit-icon">2</div>
                    <div><strong>Vastaus 2 arkipäivän kuluessa</strong><span>käsittelemme jokaisen tilauksen</span></div>
                  </div>
                  <div className="order-benefit">
                    <div className="order-benefit-icon">✓</div>
                    <div><strong>Ei sitoumuksia</strong><span>kartoitamme ensin toiveesi</span></div>
                  </div>
                </div>
              </div>

              {!isSubmitted ? (
                <form className="order-form-fields" onSubmit={handleOrderSubmit}>
                  <div className="order-form-row">
                    <div className="order-field">
                      <label htmlFor="firstName">Etunimi *</label>
                      <input id="firstName" name="firstName" type="text" placeholder="Etunimi" required />
                    </div>
                    <div className="order-field">
                      <label htmlFor="lastName">Sukunimi *</label>
                      <input id="lastName" name="lastName" type="text" placeholder="Sukunimi" required />
                    </div>
                  </div>
                  <div className="order-field">
                    <label htmlFor="email">Sähköposti *</label>
                    <input id="email" name="email" type="email" placeholder="esimerkki@email.com" required />
                  </div>
                  <div className="order-field">
                    <label htmlFor="phone">Puhelinnumero *</label>
                    <input id="phone" name="phone" type="tel" placeholder="040 123 4567" required />
                  </div>
                  <div className="order-field">
                    <label htmlFor="description">Millaisen veistoksen haluaisit? *</label>
                    <textarea id="description" name="description" rows="6" placeholder="Kerro esimerkiksi eläimestä, koosta, materiaalista, tyylistä, väristä tai muista toiveistasi..." required />
                  </div>
                  <div className="order-field">
                    <label htmlFor="files">Kuvat tai suunnitelmat <span className="optional">valinnainen</span></label>
                    <label htmlFor="files" className="order-upload">
                      <div className="order-upload-icon">↑</div>
                      <div className="order-upload-text">
                        <strong>Lisää kuvia tai suunnitelmia</strong>
                        <span>PNG, JPG tai PDF · max. 10 MB</span>
                      </div>
                      <input id="files" name="files" type="file" accept=".png,.jpg,.jpeg,.pdf" multiple />
                    </label>
                  </div>
                  <div className="order-form-bottom">
                    <label className="order-checkbox">
                      <input type="checkbox" required />
                      <span>Hyväksyn, että minuun otetaan yhteyttä tilaukseen liittyen.</span>
                    </label>
                    <button type="submit" className="order-submit">LÄHETÄ TILAUS<span>→</span></button>
                  </div>
                </form>
              ) : (
                <div className="order-success">
                  <div className="order-success-icon">✓</div>
                  <div>
                    <div className="order-success-label">TILAUS VASTAANOTETTU</div>
                    <h3>Kiitos tilauksestasi!</h3>
                    <p>Tilauksesi on vastaanotettu ja välitetään sähköpostiimme käsiteltäväksi. Tarkistamme toiveesi ja otamme sinuun yhteyttä 2 arkipäivän kuluessa.</p>
                    <p className="order-success-note">Voit olla rauhallisin mielin — tilauksesi ei mennyt hukkaan.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section ref={targetRef} className="tietoa" id="tietoa">
          <div className="tietoa__inner">
            <div className="tietoa__label">TIETOA</div>
            <div className="tietoa__content">
              <h2>Käsin tehty veistos, joka kestää aikaa.</h2>
              <p>Jokainen veistos valmistetaan käsityönä Suomessa. Veistoksen perustana on kestävä metallirunko, jonka ympärille veistos rakennetaan betonista. Muoto, yksityiskohdat ja viimeistely tehdään käsin, joten jokainen veistos on oma yksilönsä.</p>
              <p>Betoni tekee veistoksesta vahvan ja sopivan myös ulkokäyttöön. Oikein valmistettuna ja sijoitettuna veistos kestää Suomen vaihtelevia sääolosuhteita ja säilyy kauniina pitkään.</p>
              <p>Galleria esittelee esimerkkejä valmiista veistoksista ja näyttää, millaisia töitä voidaan toteuttaa. Oman veistoksen voi suunnitella yhdessä tekijän kanssa – eläimen, koon ja yksityiskohtien lisäksi myös <strong>värin voi valita</strong>.</p>
              <p>Kaikki veistokset suunnitellaan ja valmistetaan <strong>Suomessa.</strong></p>
              <div className="tietoa__cta">
                <strong>Oma idea mielessä?</strong>
                <span>Kerro meille toiveesi, niin suunnitellaan siitä oma veistos.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function GalleryItem({ number, label, sub, image, onClick, isActive }) {
  return (
    <div className={`gallery-item${isActive ? " active" : ""}`} onClick={onClick}>
      <div className="gallery-item-image">
        {image ? (
          <img src={image} alt={label} className="gallery-item-img" />
        ) : (
          <div className="gallery-item-placeholder">{number}</div>
        )}
      </div>
      <div className="gallery-item-content">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="gallery-item-title">{label}</div>
          <div className="gallery-item-sub">{sub}</div>
        </div>
        <div className="gallery-item-arrow">→</div>
      </div>
    </div>
  );
}

function StepCard({ number, title, desc, variant }) {
  const isDark = variant === "dark";
  return (
    <div className={`step-card${isDark ? " dark" : " light"}`}>
      <div className={`step-number${isDark ? " light" : " dark"}`}>{number}</div>
      <div className="step-title">{title}</div>
      <div className="step-desc">{desc}</div>
    </div>
  );
}