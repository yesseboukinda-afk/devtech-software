import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onBackToTop }) {
  const scrollToTop = () => {
    if (onBackToTop) {
      onBackToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="cc-footer">
      <div className="cc-footer-inner">
        <div className="cc-footer-grid">
          {/* Brand info with DevTech Software Logo */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <img
                src="/img/devtech-logo.png"
                alt="DevTech Software"
                style={{ height: 42, width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p className="cc-footer-desc">
              Depuis 1934, la Maison <strong>DevTech Software</strong> incarne l'héritage de l'artisanat d'élite et de la précision.
              Nous sélectionnons avec la plus stricte rigueur des pièces détachées et de l'outillage de haute précision.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="cc-footer-col-title">Collections</h4>
            <ul className="cc-footer-links">
              <li><a href="#outillage">Outillage & Soudure d'Atelier</a></li>
              <li><a href="#circuits">Cartes Mères & Circuits</a></li>
              <li><a href="#ecrans">Écrans & Dalles Haute Résolution</a></li>
              <li><a href="#puces">Puces IC & Composants CMS</a></li>
              <li><a href="#batteries">Batteries & Systèmes de Charge</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="cc-footer-col-title">Service Client</h4>
            <ul className="cc-footer-links">
              <li><a href="#contact">Contactez un Conseiller Technique</a></li>
              <li><a href="#expedition">Tarifs & Délais d'Expédition</a></li>
              <li><a href="#garantie">Politique de Garantie 2 Ans</a></li>
              <li><a href="#retours">Retours & Échanges sous 5 Jours</a></li>
              <li><a href="#faq">Foire Aux Questions (FAQ)</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="cc-footer-col-title">Cercle Privilège</h4>
            <p style={{ fontSize: 13, color: '#6e7072', marginBottom: 10 }}>
              Inscrivez-vous pour recevoir en avant-première nos arrivages de composants rares et nos offres d'exception.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Merci pour votre inscription à notre lettre d'information."); }}>
              <div className="cc-footer-newsletter-input">
                <input
                  type="email"
                  required
                  placeholder="Votre adresse courriel..."
                />
                <button
                  type="submit"
                  className="cc-btn cc-btn-primary"
                  style={{ padding: '10px 18px', fontSize: 11 }}
                >
                  Rejoindre
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cc-footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} DEVTECH SOFTWARE INC. &bull; QUALITÉ ET TRADITION DEPUIS 1934. TOUS DROITS RÉSERVÉS.
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={scrollToTop}>
              <ArrowUp size={14} /> Haut de page
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
