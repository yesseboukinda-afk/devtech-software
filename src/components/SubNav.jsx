import React from 'react';
import { Menu, Zap, Sparkles, ShieldCheck } from 'lucide-react';

export default function SubNav({
  onOpenSideDrawer,
  selectedCategory,
  onSelectCategory,
  onFilterFlashDeals,
}) {
  const quickCategories = [
    "Toutes nos catégories",
    "Meilleures Ventes",
    "Ventes Flash",
    "Outillage & Soudure",
    "Cartes Mères & Circuits",
    "Écrans & Dalles",
    "Composants CMS & IC",
    "Batteries & Alimentation",
  ];

  return (
    <div className="amz-subnav">
      <div className="amz-subnav-left">
        {/* Amazon Hamburger "Toutes" */}
        <div className="amz-subnav-item" onClick={onOpenSideDrawer} style={{ fontWeight: 700 }}>
          <Menu size={18} />
          <span>Toutes</span>
        </div>

        {quickCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <div
              key={cat}
              className={`amz-subnav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (cat === "Ventes Flash") {
                  onFilterFlashDeals();
                } else {
                  onSelectCategory(cat);
                }
              }}
            >
              {cat === "Ventes Flash" && <Zap size={14} color="#febd69" fill="#febd69" />}
              {cat === "Meilleures Ventes" && <Sparkles size={14} color="#ffd814" />}
              <span>{cat}</span>
            </div>
          );
        })}
      </div>

      <div className="amz-subnav-right">
        <ShieldCheck size={16} />
        <span>Garantie Satisfait ou Remboursé | Service Client 24/7</span>
      </div>
    </div>
  );
}
