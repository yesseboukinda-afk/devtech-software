import React, { useState, useEffect, useCallback } from 'react';
import { Award, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/img/carousel-1.jpg',
    title: 'DevTech Software',
    desc: 'Composants certifiés & équipements professionnels pour les experts du travail bien fait.',
    cta1: { label: 'Découvrir la Collection', category: 'Toutes nos catégories' },
    cta2: { label: "L'Équipement d'Atelier", category: 'Outillage & Soudure' },
  },
  {
    image: '/img/carousel-2.png',
    title: 'Matériel Professionnel',
    desc: "Outillage de précision, cartes mères et circuits électroniques — livrés partout au Gabon.",
    cta1: { label: "Voir l'Outillage", category: 'Outillage & Soudure' },
    cta2: { label: 'Cartes & Circuits', category: 'Cartes Mères & Circuits' },
  },
  {
    image: '/img/carousel-3.png',
    title: 'Qualité & Fiabilité',
    desc: 'Chaque pièce est testée et certifiée — votre satisfaction est notre engagement depuis le premier jour.',
    cta1: { label: 'Nos Meilleures Offres', category: 'Toutes nos catégories' },
    cta2: { label: 'Contactez-nous', category: 'Toutes nos catégories' },
  },
];

export default function HeroBanner({ onExploreCategory, onExploreDeals }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Autoplay toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <>
      {/* Hero Carousel */}
      <section className="cc-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Slides background */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="cc-hero-bg"
            style={{
              backgroundImage: `url('${s.image}')`,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              position: i === 0 ? 'relative' : 'absolute',
              inset: 0,
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}

        <div className="cc-hero-overlay" style={{ zIndex: 2 }} />

        <div className="cc-hero-content" style={{ position: 'relative', zIndex: 3 }}>
          <h1
            className="cc-hero-title"
            key={`title-${current}`}
            style={{ animation: 'heroFadeUp 0.6s ease both' }}
          >
            {slide.title}
          </h1>
          <p
            className="cc-hero-desc"
            key={`desc-${current}`}
            style={{ animation: 'heroFadeUp 0.7s 0.1s ease both' }}
          >
            {slide.desc}
          </p>

          <div
            className="cc-hero-actions"
            key={`actions-${current}`}
            style={{ animation: 'heroFadeUp 0.8s 0.2s ease both' }}
          >
            <button
              className="cc-btn cc-btn-white"
              onClick={() => onExploreCategory(slide.cta1.category)}
            >
              {slide.cta1.label}
            </button>
            <button
              className="cc-btn cc-btn-outline"
              style={{ color: '#ffffff', borderColor: '#ffffff' }}
              onClick={() => onExploreCategory(slide.cta2.category)}
            >
              {slide.cta2.label}
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          aria-label="Slide précédent"
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            borderRadius: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          aria-label="Slide suivant"
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            borderRadius: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            gap: 8,
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Aller au slide ${i + 1}`}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#ffffff' : 'rgba(255,255,255,0.45)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
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
