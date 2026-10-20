import React from 'react';
import { Award, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HeroBanner({ onExploreCategory, onExploreDeals }) {
  return (
    <>
      {/* Crown Cap Signature Editorial Hero */}
      <section className="cc-hero">
        <div
          className="cc-hero-bg"
          style={{
            backgroundImage: `url('/img/carousel-1.jpg')`,
          }}
        />
        <div className="cc-hero-overlay" />

        <div className="cc-hero-content">
          <span className="cc-hero-pretitle">
            DEVTECH SOFTWARE &bull; QUALITÉ ET PRÉCISION DEPUIS 1934
          </span>
          <h1 className="cc-hero-title">
            L'Excellence du Savoir-Faire & des Composants Certifiés
          </h1>
          <p className="cc-hero-desc">
            Des stations de soudage de haute voltige aux modules microcontrôleurs les plus exigeants, 
            découvrez une collection pensée pour les professionnels et passionnés du travail bien fait.
          </p>

          <div className="cc-hero-actions">
            <button
              className="cc-btn cc-btn-white"
              onClick={() => onExploreCategory("Toutes nos catégories")}
            >
              Découvrir la Collection
            </button>
            <button
              className="cc-btn cc-btn-outline"
              style={{ color: '#ffffff', borderColor: '#ffffff' }}
              onClick={() => onExploreCategory("Outillage & Soudure")}
            >
              L'Équipement d'Atelier
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Heritage Bar */}
      <section className="cc-trust-bar">
        <div className="cc-trust-inner">
          <div className="cc-trust-item">
            <Award className="cc-trust-icon" size={24} strokeWidth={1.5} />
            <h4 className="cc-trust-title">Pièces Certifiées</h4>
            <p className="cc-trust-subtitle">Testées individuellement sous banc d'essai</p>
          </div>

          <div className="cc-trust-item">
            <Truck className="cc-trust-icon" size={24} strokeWidth={1.5} />
            <h4 className="cc-trust-title">Expédition Express</h4>
            <p className="cc-trust-subtitle">Livraison soignée 24h/48h & suivi en direct</p>
          </div>

          <div className="cc-trust-item">
            <ShieldCheck className="cc-trust-icon" size={24} strokeWidth={1.5} />
            <h4 className="cc-trust-title">Garantie Atelier</h4>
            <p className="cc-trust-subtitle">Conseils techniques & assistance d'experts</p>
          </div>

          <div className="cc-trust-item">
            <RefreshCw className="cc-trust-icon" size={24} strokeWidth={1.5} />
            <h4 className="cc-trust-title">Retours 30 Jours</h4>
            <p className="cc-trust-subtitle">Satisfaction garantie ou échange sans frais</p>
          </div>
        </div>
      </section>
    </>
  );
}
