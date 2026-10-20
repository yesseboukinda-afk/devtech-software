import React from 'react';
import { X, UserCircle, ChevronRight, Zap, Award, Wrench, Cpu, Monitor, BatteryCharging, Cable, HelpCircle } from 'lucide-react';

export default function SideDrawer({ isOpen, onClose, onSelectCategory }) {
  if (!isOpen) return null;

  const handleCategoryClick = (cat) => {
    onSelectCategory(cat);
    onClose();
  };

  return (
    <>
      <div className="amz-drawer-backdrop" onClick={onClose} />
      <div className="amz-side-drawer">
        {/* User bar */}
        <div className="amz-side-drawer-header">
          <UserCircle size={28} />
          <span>Bonjour, Identifiez-vous</span>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="amz-side-drawer-body">
          <div className="amz-side-section-title">Tendances & Bons Plans</div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Meilleures Ventes")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={18} color="#e67a00" /> Meilleures Ventes
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Ventes Flash")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={18} color="#cc0c39" /> Ventes Flash du Jour
            </span>
            <ChevronRight size={16} color="#888" />
          </div>

          <div style={{ height: 1, background: '#e0e0e0', margin: '10px 0' }} />

          <div className="amz-side-section-title">Rayons Électronique & Pièces</div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Outillage & Soudure")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wrench size={18} color="#007185" /> Outillage & Soudure
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Cartes Mères & Circuits")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cpu size={18} color="#007185" /> Cartes Mères & Circuits
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Écrans & Dalles")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monitor size={18} color="#007185" /> Écrans & Dalles LCD / OLED
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Composants CMS & IC")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cpu size={18} color="#007185" /> Puces IC & CMS
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Batteries & Alimentation")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BatteryCharging size={18} color="#007185" /> Batteries & Alimentation
            </span>
            <ChevronRight size={16} color="#888" />
          </div>
          <div className="amz-side-item" onClick={() => handleCategoryClick("Connectique & Nappes")}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cable size={18} color="#007185" /> Connectique & Nappes Flex
            </span>
            <ChevronRight size={16} color="#888" />
          </div>

          <div style={{ height: 1, background: '#e0e0e0', margin: '10px 0' }} />

          <div className="amz-side-section-title">Aide & Paramètres</div>
          <div className="amz-side-item">
            <span>Votre compte</span>
          </div>
          <div className="amz-side-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={18} color="#555" /> Service Client & Assistance
            </span>
          </div>
          <div className="amz-side-item">
            <span>Se déconnecter</span>
          </div>
        </div>
      </div>
    </>
  );
}
