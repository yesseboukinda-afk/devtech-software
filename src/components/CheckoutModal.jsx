import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Smartphone, CreditCard, DollarSign, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  selectedLocation,
}) {
  const { currentUser, isLoggedIn } = useAuth();
  const [step, setStep] = useState('form');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(
    currentUser?.district
      ? `Quartier ${currentUser.district}, ${currentUser.city || ''} (${currentUser.province || ''})`
      : ''
  );
  const [paymentMethod, setPaymentMethod] = useState('airtel');
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.district || currentUser.city) {
        const parts = [];
        if (currentUser.district) parts.push(`Quartier ${currentUser.district}`);
        if (currentUser.city) parts.push(currentUser.city);
        if (currentUser.province) parts.push(`(${currentUser.province})`);
        setAddress(parts.join(', '));
      }
    }
  }, [currentUser]);

  if (!isOpen || !isLoggedIn()) return null;

  const FREE_SHIPPING_THRESHOLD = 30000;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const total = subtotal + shippingFee;

  const formattedSubtotal = new Intl.NumberFormat('fr-FR').format(subtotal);
  const formattedShipping = shippingFee === 0 ? 'Offert' : `${new Intl.NumberFormat('fr-FR').format(shippingFee)} FCFA`;
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(total);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderNumber = `DT-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      orderId: orderNumber,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      customerName,
      customerPhone,
      address: `${address}, ${selectedLocation || 'Libreville'}`,
      paymentMethod,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total,
      status: 'En cours de préparation dans nos ateliers',
    };

    setCreatedOrder(newOrder);
    setStep('confirmed');
    onOrderSuccess(newOrder);
  };

  return (
    <div className="cc-modal-backdrop" onClick={onClose}>
      <div
        className="cc-modal-dialog"
        style={{ display: 'block', maxWidth: 840, padding: 36 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cc-modal-close" onClick={onClose} title="Fermer">
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6e7072', fontWeight: 600 }}>
                EXPÉDITION SÉCURISÉE &bull; DEVTECH SOFTWARE
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginTop: 4 }}>
                Finaliser Votre Commande
              </h2>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
                {/* Form fields */}
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #e8e8e1', paddingBottom: 6 }}>
                      1. Coordonnées de Livraison
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e7072', marginBottom: 4 }}>
                          Nom complet
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e1', outline: 'none', fontSize: 13 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e7072', marginBottom: 4 }}>
                          Téléphone mobile
                        </label>
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e1', outline: 'none', fontSize: 13 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e7072', marginBottom: 4 }}>
                          Adresse de livraison & Ville
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Votre adresse ou quartier de livraison"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e1', outline: 'none', fontSize: 13 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h4 style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #e8e8e1', paddingBottom: 6 }}>
                      2. Mode de Règlement
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid', borderColor: paymentMethod === 'airtel' ? '#1f2026' : '#e8e8e1', cursor: 'pointer', background: paymentMethod === 'airtel' ? '#f9f9fb' : '#fff' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'airtel'} onChange={() => setPaymentMethod('airtel')} />
                        <Smartphone size={16} />
                        <span>Airtel Money (Code Marchand)</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid', borderColor: paymentMethod === 'moov' ? '#1f2026' : '#e8e8e1', cursor: 'pointer', background: paymentMethod === 'moov' ? '#f9f9fb' : '#fff' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'moov'} onChange={() => setPaymentMethod('moov')} />
                        <Smartphone size={16} />
                        <span>Moov Money</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid', borderColor: paymentMethod === 'card' ? '#1f2026' : '#e8e8e1', cursor: 'pointer', background: paymentMethod === 'card' ? '#f9f9fb' : '#fff' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <CreditCard size={16} />
                        <span>Carte Bancaire (Visa / Mastercard)</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid', borderColor: paymentMethod === 'cash' ? '#1f2026' : '#e8e8e1', cursor: 'pointer', background: paymentMethod === 'cash' ? '#f9f9fb' : '#fff' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                        <DollarSign size={16} />
                        <span>Paiement en espèces à la livraison</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: '#f9f9fb', padding: 24, border: '1px solid #e8e8e1', height: 'fit-content' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Récapitulatif
                  </h4>

                  <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 16 }}>
                    {cartItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                        <span style={{ maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.quantity}x {item.title}
                        </span>
                        <strong>{new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} FCFA</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #e8e8e1', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7072' }}>
                      <span>Sous-total</span>
                      <span>{formattedSubtotal} FCFA</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7072' }}>
                      <span>Livraison</span>
                      <span style={{ color: shippingFee === 0 ? '#108474' : '#1f2026', fontWeight: 600 }}>{formattedShipping}</span>
                    </div>

                    <div style={{ borderTop: '1.5px solid #1f2026', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#1f2026' }}>
                      <span>Total</span>
                      <span>{formattedTotal} FCFA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cc-btn cc-btn-primary"
                    style={{ width: '100%', marginTop: 24, padding: '14px' }}
                  >
                    Valider et Payer
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#6e7072', marginTop: 14 }}>
                    <ShieldCheck size={14} color="#108474" />
                    <span>Sécurisation SSL 256 bits</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <CheckCircle size={44} color="#108474" style={{ margin: '0 auto 16px auto' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6e7072', fontWeight: 600 }}>
              COMMANDE CONFIRMÉE &bull; DEVTECH SOFTWARE
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '8px 0 12px 0' }}>
              Merci pour votre confiance
            </h2>
            <p style={{ fontSize: 14, color: '#6e7072', maxWidth: 480, margin: '0 auto 24px auto' }}>
              Votre commande <strong>{createdOrder?.orderId}</strong> est désormais enregistrée. Nos équipes préparent votre colis avec le plus grand soin.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
              <button className="cc-btn cc-btn-outline" onClick={() => window.print()}>
                <Download size={14} /> Imprimer le reçu
              </button>
              <button className="cc-btn cc-btn-primary" onClick={onClose}>
                Continuer la Visite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
