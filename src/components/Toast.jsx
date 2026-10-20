import React, { useEffect } from 'react';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';

export default function Toast({ toast, onClose, onOpenCart }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="amz-toast">
      <CheckCircle size={22} color="#007600" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13 }}>
        <div style={{ fontWeight: 700, color: '#007600' }}>{toast.title}</div>
        <div style={{ color: '#0f1111', fontSize: 12, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {toast.message}
        </div>
      </div>

      {toast.showCartButton && (
        <button
          onClick={onOpenCart}
          style={{
            background: '#ffd814',
            border: '1px solid #fcd200',
            borderRadius: 0,
            padding: '4px 8px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Voir le panier
        </button>
      )}

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          padding: 2,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
