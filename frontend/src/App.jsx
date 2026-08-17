import "./App.css";

const galleryItems = [
  { title: "Veistos 02", subtitle: "Seuraava työ" },
  { title: "Veistos 03", subtitle: "Seuraava työ" },
];

const orderSteps = [
  { number: "01", title: "Valitse", text: "tuotteen tiedot", dark: false },
  { number: "02", title: "Lähetä", text: "tilauslomake", dark: false },
  {
    number: "03",
    title: "Sovitaan",
    text: "tilauksen yksityiskohdat",
    dark: true,
  },
];

const processSteps = [
  {
    number: "01",
    title: "Yhteydenotto",
    text: "Kerro millaista veistosta etsit ja jätä yhteystietosi.",
    active: true,
  },
  {
    number: "02",
    title: "Suunnittelu",
    text: "Sovitaan yhdessä työn yksityiskohdista ja toiveista.",
  },
  {
    number: "03",
    title: "Valmistus",
    text: "Veistos valmistetaan käsityönä betonista.",
  },
];

function App() {
  return (
    <div className="page">
      <header className="header">
        <a className="logo" href="#etusivu">
          <span className="logo-title">KAPULA</span>
          <span className="logo-subtitle">BETONIVEISTOKSET</span>
        </a>

        <nav className="navigation">
          <a className="nav-link active" href="#etusivu">
            Etusivu
          </a>
          <a className="nav-link" href="#veistokset">
            Veistokset
          </a>
          <a className="nav-link" href="#tietoa">
            Tietoa
          </a>
          <a className="nav-link" href="#yhteys">
            Yhteys
          </a>
        </nav>

        <a className="header-button" href="#tilaus">
          TILAA VEISTOS <span>→</span>
        </a>
      </header>

      <main>
        <section className="hero section" id="etusivu">
          <p className="eyebrow">BETONISTA · KÄSIN</p>

          <h1>
            Veistoksia, jotka
            <br />
            jäävät mieleen.
          </h1>

          <p className="hero-text">
            Täysikokoisia betoniveistoksia eläimistä.
            <br />
            Yksinkertainen tapa kysyä ja tehdä tilaus.
          </p>
        </section>

        <section className="section gallery-section" id="veistokset">
          <div className="gallery-box">
            <div className="gallery-header">
              <span>VEISTOSGALLERIA</span>
              <span className="gallery-number">
                01
                <br />
                / 06
              </span>
            </div>

            <div className="gallery-grid">
              <div className="main-image-placeholder">
                <div className="placeholder-title">KUVA TÄHÄN</div>
                <div className="placeholder-text">Veistoksen pääkuva</div>
              </div>

              <div className="gallery-side">
                {galleryItems.map((item) => (
                  <article className="gallery-card" key={item.title}>
                    <div className="gallery-thumb" />

                    <div className="gallery-card-content">
                      <h3>{item.title}</h3>
                      <p>{item.subtitle}</p>
                    </div>

                    <span className="arrow">→</span>
                  </article>
                ))}

                <div className="gallery-more">
                  <div>
                    <p className="gallery-more-label">GALLERIAN SELAUS</p>
                    <p className="gallery-more-title">
                      Vieritä
                      <br />
                      lisää töitä
                    </p>
                  </div>

                  <span className="round-arrow">↓</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section order-section" id="tilaus">
          <div className="order-intro">
            <p className="eyebrow">TILAAMINEN</p>
            <h2>Tilaa helposti ilman verkkokauppaa.</h2>
            <p className="section-text">
              Täytä lomake, kerro toiveesi ja jätä yhteystietosi.
            </p>
          </div>

          <div className="order-cards">
            {orderSteps.map((step) => (
              <article
                className={`order-card ${step.dark ? "order-card-dark" : ""}`}
                key={step.number}
              >
                <p className="order-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="cta-banner">
            <div>
              <h2>Haluatko oman veistoksen?</h2>
              <p>Lähetä tilaus ja olemme yhteydessä.</p>
            </div>

            <a className="cta-white-button" href="#yhteys">
              TEE TILAUS <span>→</span>
            </a>
          </div>
        </section>

        <section className="about-section" id="tietoa">
          <div className="section about-intro">
            <p className="eyebrow">TIETOA</p>
            <h2>Näin työskentelemme.</h2>
            <p className="section-text">
              Yksinkertainen prosessi alusta valmiiseen veistokseen.
            </p>
          </div>

          <div className="section about-grid">
            <div className="process-card">
              <p className="process-label">PROSESSI</p>

              <div className="process-list">
                {processSteps.map((step, index) => (
                  <article className="process-item" key={step.number}>
                    <div
                      className={`process-number ${step.active ? "process-number-active" : ""
                        }`}
                    >
                      {step.number}
                    </div>

                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>

                    {index !== processSteps.length - 1 && (
                      <div className="process-line" />
                    )}
                  </article>
                ))}
              </div>
            </div>

            <aside className="company-card" id="yhteys">
              <p className="company-label">YRITYS</p>
              <h2>Volodymyr Kapula</h2>
              <p className="company-type">Betoniveistokset</p>

              <div className="company-divider" />

              <div className="contact-group">
                <p className="contact-label">OSOITE</p>
                <p>Huhtimäentie 307</p>
                <p>77570 Jäppilä, Pieksämäki</p>
              </div>

              <div className="contact-group">
                <p className="contact-label">YHTEYS</p>
                <a href="tel:+358453444180">045 344 4180</a>
                <a href="mailto:volodimir.kapula@gmail.com">
                  volodimir.kapula@gmail.com
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer section">
        <div className="footer-logo">
          <span className="logo-title">KAPULA</span>
          <span className="logo-subtitle">BETONIVEISTOKSET</span>
        </div>

        <p>Yhteydenotto · Tilauslomake</p>
      </footer>
    </div>
  );
}

export default App;