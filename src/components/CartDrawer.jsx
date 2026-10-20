import React from 'react';
import { X, Trash2, ShoppingBag, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const { isLoggedIn } = useAuth();
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 30000;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const formattedSubtotal = new Intl.NumberFormat('fr-FR').format(subtotal);
  const formattedRemaining = new Intl.NumberFormat('fr-FR').format(amountRemaining);

  return (
    <>
      <div className="cc-modal-backdrop" onClick={onClose} />
      <div className="cc-cart-drawer">
        {/* Header */}
        <div className="cc-cart-drawer-header">
          <h3 className="cc-cart-drawer-title">
            Panier d'Achats ({totalCount})
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#1f2026',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '14px 28px', backgroundColor: '#f9f9fb', borderBottom: '1px solid #e8e8e1', fontSize: 12 }}>
          {subtotal >= FREE_SHIPPING_THRESHOLD ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#108474', fontWeight: 600 }}>
              <CheckCircle size={14} />
              <span>Votre commande bénéficie de la <strong>Livraison Gratuite</strong> !</span>
            </div>
          ) : (
            <div style={{ color: '#1f2026' }}>
              Ajoutez encore <strong style={{ color: '#ba4444' }}>{formattedRemaining} FCFA</strong> pour la <strong>Livraison Offerte</strong>
            </div>
          )}
          <div style={{ height: 3, background: '#e8e8e1', marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${freeShippingProgress}%`, background: '#108474', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cc-cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: '#6e7072' }}>
              <ShoppingBag size={44} strokeWidth={1} style={{ margin: '0 auto 16px auto', display: 'block', opacity: 0.4 }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#1f2026', marginBottom: 8 }}>
                Votre panier est vide
              </h4>
              <p style={{ fontSize: 13, marginBottom: 24 }}>
                Explorez nos collections pour trouver les composants et équipements adaptés à vos besoins.
              </p>
              <button className="cc-btn cc-btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Explorer la Boutique
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = new Intl.NumberFormat('fr-FR').format(item.price * item.quantity);
              return (
                <div key={item.id} className="cc-cart-row">
                  <img src={item.image} alt={item.title} className="cc-cart-row-img" />
                  <div className="cc-cart-row-body">
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8e9092' }}>
                      {item.brand}
                    </div>
                    <div className="cc-cart-row-title">{item.title}</div>
                    <div className="cc-cart-row-price">{itemTotal} FCFA</div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="cc-qty-input-group" style={{ margin: 0 }}>
                        <button
                          className="cc-qty-btn"
                          style={{ padding: '4px 10px' }}
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="cc-qty-num" style={{ padding: '0 10px', fontSize: 12 }}>
                          {item.quantity}
                        </span>
                        <button
                          className="cc-qty-btn"
                          style={{ padding: '4px 10px' }}
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8e9092',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                        }}
                        title="Retirer"
                      >
                        <Trash2 size={13} />
                        <span>Retirer</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cc-cart-drawer-footer">
            <div className="cc-cart-subtotal-line">
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 13, color: '#6e7072' }}>
                Sous-total ({totalCount} articles) :
              </span>
              <span style={{ fontSize: 18, color: '#1f2026' }}>
                {formattedSubtotal} FCFA
              </span>
            </div>

            <p style={{ fontSize: 11, color: '#8e9092', marginBottom: 14 }}>
              Taxes et frais d'expédition calculés lors de l'étape de validation.
            </p>

            {!isLoggedIn() && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '8px 12px',
                fontSize: 12,
                color: '#92400e',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Lock size={14} style={{ flexShrink: 0 }} />
                <span>Connectez-vous pour finaliser votre commande.</span>
              </div>
            )}

            <button
              className="cc-btn cc-btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onClick={() => {
                onClose();
                onCheckout();
              }}
            >
              {!isLoggedIn() && <Lock size={15} />}
              <span>{isLoggedIn() ? 'Finaliser la Commande' : 'Se connecter & Payer'}</span>
            </button>
          </div>
        )}
      </div> 
    </>
  );
}
