import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ShoppingCart,
  Zap,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Galerie d'images
  const images = product?.images && product.images.length > 0
    ? product.images
    : (product?.image ? [product.image] : []);

  useEffect(() => {
    setActiveImageIdx(0);
    setIsImageZoomed(false);
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const currentImage = images[activeImageIdx] || product.image;
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);
  const formattedOldPrice = product.oldPrice ? new Intl.NumberFormat('fr-FR').format(product.oldPrice) : null;

  const handleCloseModal = () => {
    setIsImageZoomed(false);
    onClose();
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="dt-product-backdrop" onClick={handleCloseModal}>
      <div
        className="dt-product-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          overflow: isImageZoomed ? 'hidden' : 'auto',
        }}
      >
        {/* ── Mode Image Agrandie (Zoom In) plein cadre qui cache la description ── */}
        {isImageZoomed && (
          <div
            className="dt-product-zoomed-view"
            onClick={() => setIsImageZoomed(false)}
            title="Cliquer pour refermer"
          >
            {/* Bouton croix pour fermer le zoom */}
            <button
              className="dt-product-zoomed-close"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageZoomed(false);
              }}
              title="Refermer l'image agrandie"
            >
              <X size={24} />
            </button>

            {/* Flèches de navigation en plein écran si multi-photos */}
            {images.length > 1 && (
              <>
                <button
                  className="dt-gallery-nav-btn prev"
                  style={{ width: 44, height: 44, left: 24 }}
                  onClick={handlePrev}
                  title="Photo précédente"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="dt-gallery-nav-btn next"
                  style={{ width: 44, height: 44, right: 24 }}
                  onClick={handleNext}
                  title="Photo suivante"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Arrière-plan ambiance flouté */}
            <div
              className="dt-product-blur-bg"
              style={{
                backgroundImage: `url(${currentImage})`,
                opacity: 0.22,
                filter: 'blur(35px)',
              }}
            />

            {/* Image en grand avec effet Zoom In */}
            <img
              key={`zoomed-${activeImageIdx}`}
              src={currentImage}
              alt={product.title}
              className="dt-product-zoomed-img"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageZoomed(false);
              }}
            />

            {/* Miniatures en bas du zoom si plusieurs photos */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 14,
                  zIndex: 20,
                  maxWidth: '90%',
                  overflowX: 'auto',
                  padding: '6px 0',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: 48,
                      height: 48,
                      border: idx === activeImageIdx ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.15)',
                      background: '#fff',
                      borderRadius: 0,
                      cursor: 'pointer',
                      padding: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: idx === activeImageIdx ? 1 : 0.6,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: '#64748b',
                background: 'rgba(255,255,255,0.85)',
                padding: '4px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: 0,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              Photo {activeImageIdx + 1} sur {images.length} &bull; Cliquez sur la croix pour refermer
            </div>
          </div>
        )}

        {/* Close Button de la modale */}
        <button
          onClick={handleCloseModal}
          title="Fermer"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: 6,
            zIndex: 10,
            transition: 'transform 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#062537')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <X size={22} />
        </button>

        {/* ── Left Column: Carré flouté avec animation Zoom Out & Galerie ── */}
        <div>
          <div
            className="dt-product-blur-square"
            onClick={() => setIsImageZoomed(true)}
            style={{ cursor: 'zoom-in' }}
            title="Cliquez pour agrandir l'image"
          >
            {/* Arrière-plan flouté reprenant la photo active */}
            <div
              className="dt-product-blur-bg"
              style={{ backgroundImage: `url(${currentImage})` }}
            />
            {/* Image nette du produit */}
            <img
              key={`zoom-out-${product.id}-${activeImageIdx}`}
              src={currentImage}
              alt={product.title}
              className="dt-product-zoom-out-img"
            />

            {/* Flèches de navigation sur le carré si plusieurs photos */}
            {images.length > 1 && (
              <>
                <button
                  className="dt-gallery-nav-btn prev"
                  onClick={handlePrev}
                  title="Photo précédente"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="dt-gallery-nav-btn next"
                  onClick={handleNext}
                  title="Photo suivante"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Badge incitatif d'agrandissement */}
            <div className="dt-zoom-badge">
              <ZoomIn size={12} />
              <span>Agrandir</span>
            </div>
          </div>

          {/* Miniatures Multi-Photos */}
          {images.length > 1 && (
            <div className="dt-gallery-thumbs-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`dt-gallery-thumb ${idx === activeImageIdx ? 'active' : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                  title={`Photo ${idx + 1}`}
                >
                  <img src={img} alt={`${product.title} angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Badges réassurance */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              textAlign: 'center',
              fontSize: 11,
              color: '#64748b',
              marginTop: images.length > 1 ? 14 : 16,
            }}
          >
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 0, border: '1px solid #e2e8f0' }}>
              <Truck size={18} color="#DE0A3A" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Livraison 24h</span>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 0, border: '1px solid #e2e8f0' }}>
              <ShieldCheck size={18} color="#10b981" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Garantie 2 ans</span>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 0, border: '1px solid #e2e8f0' }}>
              <RefreshCw size={18} color="#062537" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>SAV Atelier</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Détails avec animation Zoom In (masquée si zoom actif) ── */}
        <div
          className="dt-product-info-zoom-in"
          key={`zoom-in-${product.id}`}
          style={{ visibility: isImageZoomed ? 'hidden' : 'visible' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#64748b',
              }}
            >
              {product.brand}
            </span>
            {product.deal && (
              <span
                style={{
                  background: '#fef2f2',
                  color: '#DE0A3A',
                  border: '1px solid #fecaca',
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  borderRadius: 0,
                }}
              >
                ÉCONOMIE -{product.dealDiscount}%
              </span>
            )}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              fontWeight: 700,
              color: '#062537',
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            {product.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{product.rating} / 5</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>({product.reviewsCount} avis vérifiés)</span>
          </div>

          {/* Stock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#10b981',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: '#10b981',
                display: 'inline-block',
                borderRadius: '50%',
              }}
            />
            <span>En stock dans nos entrepôts DevTech &bull; Expédié sous 24h</span>
          </div>

          {/* Price Box */}
          <div
            style={{
              background: '#f8fafc',
              padding: 16,
              borderRadius: 0,
              border: '1px solid #e2e8f0',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#DE0A3A' }}>
                {formattedPrice} FCFA
              </span>
              {formattedOldPrice && (
                <span
                  style={{
                    fontSize: 15,
                    color: '#94a3b8',
                    textDecoration: 'line-through',
                  }}
                >
                  {formattedOldPrice} FCFA
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Prix TTC incluant toutes les taxes et frais de contrôle qualité.
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#062537' }}>Quantité :</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #cbd5e1',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                -
              </button>
              <span style={{ padding: '0 16px', fontWeight: 700, fontSize: 13.5 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="cc-btn cc-btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onClick={() => {
                onAddToCart(product, quantity);
                handleCloseModal();
              }}
            >
              <ShoppingCart size={17} />
              <span>
                Ajouter au Panier &bull; {new Intl.NumberFormat('fr-FR').format(product.price * quantity)} FCFA
              </span>
            </button>

            <button
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                backgroundColor: '#062537',
                color: '#fff',
                border: 'none',
                borderRadius: 0,
                fontWeight: 700,
                fontSize: 13.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b354d')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#062537')}
              onClick={() => {
                onBuyNow(product, quantity);
                handleCloseModal();
              }}
            >
              <Zap size={17} color="#ff4d6d" />
              <span>Acheter Maintenant (Commande Express)</span>
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              style={{
                background: 'none',
                border: 'none',
                color: isWishlisted ? '#DE0A3A' : '#64748b',
                fontSize: 12.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
            >
              <Heart
                size={15}
                fill={isWishlisted ? '#DE0A3A' : 'none'}
                color={isWishlisted ? '#DE0A3A' : 'currentColor'}
              />
              <span>{isWishlisted ? 'Produit dans votre liste d’envies' : 'Ajouter à ma liste d’envies'}</span>
            </button>
          </div>

          {/* Features */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#062537',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Spécifications & Points forts
            </h4>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: 18,
                fontSize: 12.5,
                color: '#475569',
                lineHeight: 1.6,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              {product.features?.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 10 }}>
              <strong>SKU :</strong> {product.sku} &bull; <strong>Garantie :</strong> {product.warranty}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
