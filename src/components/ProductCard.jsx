import React, { useState } from 'react';
import { Heart, Plus, Star, Check } from 'lucide-react';

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) {
  const [isJustAdded, setIsJustAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);
  const formattedOldPrice = product.oldPrice ? new Intl.NumberFormat('fr-FR').format(product.oldPrice) : null;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1600);
  };

  return (
    <div className="cc-card">
      {/* Product Image Frame */}
      <div className="cc-card-image-wrap" onClick={() => onSelectProduct(product)}>
        {/* Badges */}
        {product.deal && (
          <span className="cc-badge-sale">
            Solde -{product.dealDiscount}%
          </span>
        )}
        {!product.deal && product.bestSeller && (
          <span className="cc-badge-heritage">
            Pépite Atelier
          </span>
        )}

        <img src={product.image} alt={product.title} loading="lazy" />

        {/* Wishlist Button */}
        <button
          className={`cc-card-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          title={isWishlisted ? "Retirer de vos favoris" : "Ajouter à vos favoris"}
        >
          <Heart
            size={16}
            fill={isWishlisted ? "#ba4444" : "none"}
            color={isWishlisted ? "#ba4444" : "#1f2026"}
          />
        </button>

        {/* Quick Add Button Sliding Up on Hover */}
        <button
          className="cc-card-quick-add"
          onClick={handleQuickAdd}
          style={{
            backgroundColor: isJustAdded ? '#108474' : 'var(--color-primary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {isJustAdded ? (
              <>
                <Check size={14} /> Ajouté au panier !
              </>
            ) : (
              <>
                <Plus size={14} /> Ajout Rapide
              </>
            )}
          </span>
        </button>
      </div>

      {/* Product Meta */}
      <div className="cc-card-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="cc-card-vendor">{product.brand}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: 11 }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ color: '#6e7072', fontWeight: 600 }}>{product.rating}</span>
          </div>
        </div>

        <h3
          className="cc-card-title"
          onClick={() => onSelectProduct(product)}
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="cc-card-price-row">
          <span className={`cc-card-price ${product.deal ? 'on-sale' : ''}`}>
            {formattedPrice} FCFA
          </span>
          {formattedOldPrice && (
            <span className="cc-card-price-old">
              {formattedOldPrice} FCFA
            </span>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#108474', fontWeight: 600, marginTop: 4 }}>
          &bull; En stock &bull; Expédié en 24h
        </div>
      </div>
    </div>
  );
}
