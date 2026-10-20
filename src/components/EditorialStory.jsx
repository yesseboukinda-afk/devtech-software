import React from 'react';

export default function EditorialStory({ onExplore }) {
  return (
    <section className="cc-story-section" id="notre-histoire">
      <div className="cc-story-inner">
        {/* Story Text */}
        <div className="cc-story-content">
          <span className="cc-story-badge">
            DEVTECH SOFTWARE &bull; HÉRITAGE DEPUIS 1934
          </span>
          <h2 className="cc-story-title">
            L'Art de la Haute Précision & la Passion du Bel Ouvrage
          </h2>
          <p className="cc-story-paragraph">
            À l'image de la grande tradition d'artisanat d'élite et de précision technique instaurée en 1934,
            l'engagement de <strong>DevTech Software</strong> repose sur une exigence absolue : sélectionner
            les meilleurs composants et les outillages les plus fiables pour garantir une longévité sans compromis.
          </p>
          <p className="cc-story-paragraph">
            Que vous réalisiez une intervention minutieuse sous microscope ou le déploiement d'équipements complets,
            chacune de nos références est inspectée et conditionnée selon les normes de qualité les plus strictes.
          </p>

          <blockquote style={{ borderLeft: '2px solid #1f2026', paddingLeft: 18, fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: '#1f2026', fontSize: 16, margin: '24px 0' }}>
            « La vraie perfection ne réside pas dans ce qui se voit au premier coup d'œil, mais dans la précision de chaque micro-composant assemblé. »
          </blockquote>

          <button
            className="cc-btn cc-btn-primary"
            onClick={onExplore}
            style={{ marginTop: 10 }}
          >
            Explorer l'Atelier
          </button>
        </div>

        {/* Story Image */}
        <div
          className="cc-story-img-wrap"
          style={{
            backgroundImage: `url('/img/header-img.jpg')`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '16px 22px',
              border: '1px solid #e8e8e1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Ateliers DevTech Software
            </div>
            <div style={{ fontSize: 12, color: '#6e7072', marginTop: 4 }}>
              Pièces certifiées & Outillage haute précision
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
