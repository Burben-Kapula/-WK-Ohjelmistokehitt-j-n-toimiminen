import { useRef, useEffect, useState } from "react";
import api from "../api";
import "../styles/fonts.css";
import "../App.css";
import logoImg from "../assets/logo/logo.png";

export default function LandingPage() {
  const targetRef = useRef(null);
  const orderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then((res) => Array.isArray(res.data) && setPosts(res.data))
      .catch((err) => console.error("Galleriaveistosten lataaminen epäonnistui:", err));
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const openOrderForm = () => {
    setIsOrderOpen(true);
    setIsSubmitted(false);
    setSubmitError("");
    setTimeout(() => scrollTo(orderRef), 100);
  };

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/order/request", formData);
      setIsSubmitted(true);
      setTimeout(() => scrollTo(orderRef), 100);
    } catch (err) {
      const details = err.response?.data?.details;
      const firstDetail = details && Object.values(details).flat()[0];
      setSubmitError(firstDetail || err.response?.data?.error || "Virhe lähetyksessä.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      {/* Шапка в стиле Editorial */}
      <header className="header">
        <span className="header-flag" role="img" aria-label="Suomen lippu">🇫🇮</span>
        <div className="header-brand" onClick={scrollToTop}>
          <img src={logoImg} alt="k.Betoniveistokset" className="logo" />
        </div>
        {isVisible && (
          <button className="back-to-top" onClick={scrollToTop} aria-label="Takaisin ylös">↑</button>
        )}
        <nav className="nav">
          <button className="nav-link" onClick={() => scrollTo(targetRef)}>Tietoa</button>
        </nav>
        <button className="cta-button" onClick={openOrderForm}>TILAA VEISTOS<span>→</span></button>
      </header>

      <main className="main">
        {/* Главный экран (Hero) с параллаксом */}
        <section className="hero">
          <div className="hero-top-info">
            <span>KÄSINVALMISTETUT BETONIVEISTOKSET</span>
            <span>SUOMEN VALMISTE · 2026</span>
          </div>
          <h1 className="hero-title">VEISTOKSIA KOTIIN JA PIHAAN.</h1>
          <p className="hero-desc">
            Uniikkeja eläinveistoksia suoraan tekijältä. Toteutamme teokset vaivattomasti omien toiveidesi mukaan.
          </p>
        </section>

        {/* Сетка галереи */}
        <section className="editorial-gallery">
          <div className="section-header-line">
            <h2>Kokoelma / Teokset</h2>
            <span>{posts.length} kpl</span>
          </div>

          <div className="editorial-grid">
            {posts.length > 0 ? (
              posts.map((post, idx) => {
                const uniqueId = `film-${post.id || idx}`; 

                return (
                  <div key={post.id || idx} className="editorial-card">
                    <input type="checkbox" id={uniqueId} className="film-trigger" />

                    <div className="editorial-card-img-wrap">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title || "Veistos"} className="editorial-card-img" />
                      ) : (
                        <div className="editorial-card-placeholder">EI KUVAA</div>
                      )}
                      
                      <label htmlFor={uniqueId} className="film-arrow" onClick={(e) => e.stopPropagation()}>→</label>
                    </div>

                    <div className="filmstrip">
                      <img src={post.imageUrl || "/photo1_2.jpg"} alt={`${post.title || "Veistos"} – näkymä 2`} />
                      <img src={post.imageUrl || "/photo1_3.jpg"} alt={`${post.title || "Veistos"} – näkymä 3`} />
                    </div>

                    <div className="editorial-card-footer" onClick={openOrderForm}>
                      <span className="card-title">{post.title || `Veistos ${String(idx + 1).padStart(2, "0")}`}</span>
                      <span className="card-tag">Tilaa →</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="editorial-card">
                <div className="editorial-card-img-wrap"><div className="editorial-card-placeholder">Ladataan...</div></div>
                <div className="editorial-card-footer"><span className="card-title">Ladataan teoksia</span></div>
              </div>
            )}
          </div>
        </section>

        {/* Блок информации */}
        <section ref={targetRef} className="editorial-info" id="tietoa">
          <div className="info-header-line"><h2>Tietoa meistä</h2></div>
          <div className="info-columns">
            <div>
              <h3>Käsin tehty veistos, joka kestää aikaa.</h3>
              <p>Jokainen veistos valmistetaan huolellisena käsityönä Suomessa. Ytimenä toimii tukeva metallirunko, jonka ympärille veistos rakennetaan säänkestävästä betonista.</p>
            </div>
            <div>
              <p>Betoni materiaalina tekee teoksesta erittäin vahvan ja ulkokäyttöön soveltuvan. Se kestää vaihtelevia sääolosuhteita ja säilyy kauniina vuosikymmenestä toiseen.</p>
              <button className="info-action-btn" onClick={openOrderForm}>Aloita tilaus →</button>
            </div>
          </div>
        </section>

        {/* Форма заказа */}
        {isOrderOpen && (
          <section ref={orderRef} className="order-section-editorial">
            <div className="order-box">
              <div className="order-box-left">
                <h2>Tilauslomake</h2>
                <p>Kerro millaisen veistoksen toivot. Otamme yhteyttä kahden arkipäivän kuluessa.</p>
              </div>
              {!isSubmitted ? (
                <form className="order-box-form" onSubmit={handleOrderSubmit}>
                  <div className="form-row">
                    <input name="firstName" type="text" placeholder="Etunimi *" autoComplete="given-name" required />
                    <input name="lastName" type="text" placeholder="Sukunimi *" autoComplete="family-name" required />
                  </div>
                  <input name="email" type="email" placeholder="Sähköposti *" autoComplete="email" required />
                  <input name="phone" type="tel" inputMode="tel" placeholder="Puhelinnumero *" autoComplete="tel" required />
                  <textarea name="description" rows="5" placeholder="Kerro toiveistasi (koko, eläin, tyyli, väri)..." required />
                  {submitError && <div className="error-msg" role="alert">{submitError}</div>}
                  <button type="submit" className="editorial-submit" disabled={submitting}>
                    {submitting ? "Lähetetään..." : "Lähetä tilauspyyntö →"}
                  </button>
                </form>
              ) : (
                <div className="order-success-msg" role="status" aria-live="polite">
                  <h3>Kiitos tilauksestasi!</h3>
                  <p>Otamme sinuun pian yhteyttä.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ====== НОВЫЙ ПРОФЕССИОНАЛЬНЫЙ ПОДВАЛ ====== */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>k.Betoniveistokset</h2>
            <p>Käsintehty Suomessa. Kestää aikaa.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Yhteystiedot</h4>
              <a href="mailto:info@betoniveistokset.fi">info@betoniveistokset.fi</a>
              <a href="#">+358 40 123 4567</a>
            </div>
            <div className="footer-col">
              <h4>Seuraa meitä</h4>
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 k.Betoniveistokset. Kaikki oikeudet pidätetään.</span>
          <span>Suunniteltu Suomessa</span>
        </div>
      </footer>
    </div>
  );
}