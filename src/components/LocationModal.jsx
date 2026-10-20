import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';

export default function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) {
  if (!isOpen) return null;

  const locations = [
    { city: "Libreville", country: "Gabon", flag: "🇬🇦", desc: "Livraison standard 24h & Express 4h" },
    { city: "Port-Gentil", country: "Gabon", flag: "🇬🇦", desc: "Livraison bateau / avion 48h" },
    { city: "Franceville", country: "Gabon", flag: "🇬🇦", desc: "Livraison train Setrag 48h" },
    { city: "Oyem", country: "Gabon", flag: "🇬🇦", desc: "Livraison route sécurisée" },
    { city: "Abidjan", country: "Côte d'Ivoire", flag: "🇨🇮", desc: "Expédition fret aérien 72h" },
    { city: "Douala", country: "Cameroun", flag: "🇨🇲", desc: "Expédition internationale express" },
    { city: "Paris", country: "France", flag: "🇫🇷", desc: "Livraison DHL / Colissimo International" },
  ];

  return (
    <div className="amz-modal-backdrop" onClick={onClose}>
      <div
        className="amz-modal-content"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ background: '#f0f2f2', padding: '14px 20px', borderBottom: '1px solid #d5d9d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
            <MapPin size={18} color="#e77600" />
            <span>Choisissez votre adresse de livraison</span>
          </div>
          <button className="amz-modal-close" onClick={onClose} style={{ position: 'static' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 13, color: '#565959', marginBottom: 16 }}>
            Les options et la vitesse de livraison s'adapteront automatiquement en fonction de la destination sélectionnée.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {locations.map((loc) => {
              const label = `${loc.city} ${loc.flag}`;
              const isSelected = currentLocation === label || currentLocation?.startsWith(loc.city);
              return (
                <div
                  key={loc.city}
                  onClick={() => {
                    onSelectLocation(label);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    border: isSelected ? '2px solid #e77600' : '1px solid #d5d9d9',
                    borderRadius: 6,
                    background: isSelected ? '#fff9e6' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1111' }}>
                      {loc.city}, {loc.country} {loc.flag}
                    </div>
                    <div style={{ fontSize: 12, color: '#565959', marginTop: 2 }}>{loc.desc}</div>
                  </div>
                  {isSelected && <Check size={18} color="#e77600" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
