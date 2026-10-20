import React, { useState } from 'react';
import { Heart, Check, Pencil, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Badge de disponibilité selon le stock ────────────────────────────────────
// = 1       → "Pièce Unique"  (or/doré)
// 2 – 100   → "Stock Limité"  (orange)
// ≥ 200     → "En Stock"      (vert)
// 101-199   → pas de badge
function getStockBadge(stock) {
  if (stock === undefined || stock === null) return null;
  const qty = Number(stock);
  if (Number.isNaN(qty))  return null;
  if (qty === 1)          return { label: 'Pièce Unique', cls: 'cc-badge-stock--unique' };
  if (qty <= 100)         return { label: 'Stock Limité', cls: 'cc-badge-stock--low' };
  if (qty >= 200)         return { label: 'En Stock',     cls: 'cc-badge-stock--ok' };
  return null;
}

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onEditProduct,
}) {
  const { isSuperAdmin } = useAuth();
  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1600);
  };

  const stockBadge = getStockBadge(product.stock);

  return (
    <div className="cc-card">
      {/* Product Image Frame */}
      <div className="cc-card-image-wrap" onClick={() => onSelectProduct(product)}>

        {/* ── Badges haut-gauche : Solde / Pépite Atelier ── */}
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

        {/* ── Badge stock bas-gauche ── */}
        {stockBadge && (
          <span className={`cc-badge-stock ${stockBadge.cls}`}>
            {stockBadge.label}
          </span>
        )}

        {/* Super Admin Edit Button */}
        {isSuperAdmin() && (
          <button
            className="cc-card-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            title="Modifier ce produit"
          >
            <Pencil size={13} />
          </button>
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
      </div>

      {/* Product Meta */}
      <div className="cc-card-info">
        <h3
          className="cc-card-title"
          onClick={() => onSelectProduct(product)}
          title={product.title}
        >
          {product.title}
        </h3>

        <button
          className={`cc-card-add-btn ${isJustAdded ? 'added' : ''}`}
          onClick={handleAdd}
          title="Ajouter au panier"
        >
          {isJustAdded ? (
            <>
              <Check className="cc-card-add-icon" size={14} />
              <span className="cc-card-add-btn-text">Ajouté !</span>
            </>
          ) : (
            <>
              <ShoppingCart className="cc-card-add-icon" size={14} />
              <span className="cc-card-add-btn-text">Ajouter au panier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
