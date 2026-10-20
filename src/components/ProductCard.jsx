import React, { useState } from 'react';
import { Heart, Check, Pencil, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

      {/* Product Meta: Uniquement le Nom du Produit et le Bouton Ajouter au Panier */}
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
