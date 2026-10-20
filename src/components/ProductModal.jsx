import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Truck, RefreshCw, Check, Star, ShoppingCart, Zap } from 'lucide-react';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);
  const formattedOldPrice = product.oldPrice ? new Intl.NumberFormat('fr-FR').format(product.oldPrice) : null;

  return (
    <div className="dt-modal-backdrop" onClick={onClose}>
      <div className="dt-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="dt-modal-close" onClick={onClose} title="Fermer">
          <X size={20} />
        </button>

        {/* Left Column: Image */}
        <div>
          <div className="dt-modal-img-box">
            <img src={product.image} alt={product.title} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center', fontSize: 11, color: '#64748b', marginTop: 16 }}>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Truck size={18} color="#DE0A3A" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Livraison 24h</span>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <ShieldCheck size={18} color="#10b981" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Garantie 2 ans</span>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <RefreshCw size={18} color="#062537" style={{ margin: '0 auto 4px auto', display: 'block' }} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>SAV Atelier</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="dt-card-brand">{product.brand}</span>
            {product.deal && (
              <span className="dt-badge-deal">
                ÉCONOMIE -{product.dealDiscount}%
              </span>
            )}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#062537', lineHeight: 1.3, marginBottom: 10 }}>
            {product.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{product.rating} / 5</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>({product.reviewsCount} avis vérifiés)</span>
          </div>

          {/* Stock */}
          <div className="dt-stock-status" style={{ marginBottom: 16 }}>
            <span className="dt-stock-dot" />
            <span>En stock dans nos entrepôts DevTech &bull; Expédié sous 24h</span>
          </div>

          {/* Price Box */}
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#DE0A3A' }}>
                {formattedPrice} FCFA
              </span>
              {formattedOldPrice && (
                <span className="dt-price-old" style={{ fontSize: 15 }}>
                  {formattedOldPrice} FCFA
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Prix TTC incluant toutes les taxes et frais de douane.
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#062537' }}>Quantité :</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', cursor: 'pointer', fontWeight: 800 }}
              >
                -
              </button>
              <span style={{ padding: '0 16px', fontWeight: 700, fontSize: 14 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', cursor: 'pointer', fontWeight: 800 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="dt-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
            >
              <ShoppingCart size={18} />
              <span>Ajouter au Panier &bull; {new Intl.NumberFormat('fr-FR').format(product.price * quantity)} FCFA</span>
            </button>

            <button
              className="dt-btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', backgroundColor: '#062537', color: '#fff', border: 'none' }}
              onClick={() => {
                onBuyNow(product, quantity);
                onClose();
              }}
            >
              <Zap size={18} color="#ff4d6d" />
              <span>Acheter Maintenant (Commande Express)</span>
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              style={{
                background: 'none',
                border: 'none',
                color: isWishlisted ? '#DE0A3A' : '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 0',
              }}
            >
              <Heart size={15} fill={isWishlisted ? "#DE0A3A" : "none"} color={isWishlisted ? "#DE0A3A" : "currentColor"} />
              <span>{isWishlisted ? "Produit dans votre liste de souhaits" : "Ajouter à ma liste d'envies"}</span>
            </button>
          </div>

          {/* Features */}
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#062537', textTransform: 'uppercase', marginBottom: 10 }}>
              Points forts & Spécifications
            </h4>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, fontSize: 13, color: '#475569', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {product.features?.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
              <strong>SKU :</strong> {product.sku} &bull; <strong>Garantie :</strong> {product.warranty}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
