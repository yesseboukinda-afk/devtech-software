import React from 'react';
import { X, Package, CheckCircle, Truck, Clock, Download } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  return (
    <div className="amz-modal-backdrop" onClick={onClose}>
      <div
        className="amz-modal-content"
        style={{ maxWidth: 840 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="amz-modal-close" onClick={onClose} title="Fermer">
          <X size={20} />
        </button>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Package size={26} color="#007185" />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f1111' }}>
              Vos Commandes & Suivi de Colis
            </h2>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#565959' }}>
              <Package size={48} strokeWidth={1} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: 17, color: '#0f1111', marginBottom: 6 }}>Vous n'avez aucune commande récente</h3>
              <p style={{ fontSize: 13 }}>Toutes vos commandes et factures apparaîtront ici.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="amz-order-card">
                <div className="amz-order-card-header">
                  <div>
                    <span style={{ textTransform: 'uppercase' }}>Commande effectuée le</span>
                    <div style={{ color: '#0f1111', fontWeight: 600 }}>{order.date}</div>
                  </div>
                  <div>
                    <span style={{ textTransform: 'uppercase' }}>Total</span>
                    <div style={{ color: '#0f1111', fontWeight: 600 }}>
                      {new Intl.NumberFormat('fr-FR').format(order.total)} FCFA
                    </div>
                  </div>
                  <div>
                    <span style={{ textTransform: 'uppercase' }}>Livrer à</span>
                    <div style={{ color: '#007185', fontWeight: 600 }}>{order.customerName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ textTransform: 'uppercase' }}>N° de commande</span>
                    <div style={{ color: '#0f1111', fontWeight: 600 }}>{order.orderId}</div>
                  </div>
                </div>

                <div className="amz-order-card-body">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#007600', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
                      <CheckCircle size={18} />
                      <span>Statut : {order.status}</span>
                    </div>

                    {/* Amazon Tracking Progress Bar */}
                    <div style={{ background: '#f8f9fa', padding: 14, borderRadius: 6, marginBottom: 16 }}>
                      <div className="amz-tracking-bar">
                        <div style={{ position: 'absolute', top: 7, left: 15, right: 15, height: 3, background: '#007600', zIndex: 1 }} />
                        <div className="amz-tracking-step">
                          <div className="amz-tracking-dot" />
                          <span>Commandé</span>
                        </div>
                        <div className="amz-tracking-step">
                          <div className="amz-tracking-dot" />
                          <span>Préparation</span>
                        </div>
                        <div className="amz-tracking-step">
                          <div className="amz-tracking-dot" style={{ background: '#ffa41c' }} />
                          <span style={{ color: '#0f1111' }}>En route</span>
                        </div>
                        <div className="amz-tracking-step">
                          <div className="amz-tracking-dot" style={{ background: '#ccc' }} />
                          <span style={{ color: '#888' }}>Livré</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: '#565959', textAlign: 'center', marginTop: 8 }}>
                        Colis pris en charge par le transporteur Red_link Express. Livraison estimée demain.
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'contain', background: '#f8f8f8', borderRadius: 4, padding: 4 }} />
                          <div style={{ flex: 1, fontSize: 13 }}>
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div style={{ color: '#565959', fontSize: 12 }}>Qté : {item.quantity} | Prix : {new Intl.NumberFormat('fr-FR').format(item.price)} FCFA</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                    <button
                      className="amz-btn-add"
                      style={{ padding: '8px 12px', fontSize: 12 }}
                      onClick={() => window.print()}
                    >
                      <Download size={14} />
                      <span>Télécharger facture</span>
                    </button>
                    <button
                      style={{
                        background: '#ffffff',
                        border: '1px solid #d5d9d9',
                        borderRadius: 9999,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() => alert(`Suivi en temps réel activé pour le colis ${order.orderId}. Position actuelle : Entrepôt Central Libreville.`)}
                    >
                      Suivre le colis
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
