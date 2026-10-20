import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({
  title,
  subtitle,
  products,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onViewAll,
}) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -550 : 550;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="amz-section-carousel">
      <div className="amz-carousel-box">
        <div className="amz-carousel-header">
          <h2 className="amz-carousel-title">
            <span>{title}</span>
            {subtitle && (
              <span style={{ fontSize: 13, fontWeight: 500, color: '#565959' }}>
                {subtitle}
              </span>
            )}
          </h2>
          {onViewAll && (
            <span className="amz-carousel-link" style={{ cursor: 'pointer' }} onClick={onViewAll}>
              Voir plus
            </span>
          )}
        </div>

        <div className="amz-carousel-track-wrap">
          <button
            className="amz-track-btn left"
            onClick={() => scroll('left')}
            title="Défiler vers la gauche"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="amz-carousel-track" ref={trackRef}>
            {products.map((product) => (
              <div key={product.id} style={{ width: 260, flexShrink: 0 }}>
                <ProductCard
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
          </div>

          <button
            className="amz-track-btn right"
            onClick={() => scroll('right')}
            title="Défiler vers la droite"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
