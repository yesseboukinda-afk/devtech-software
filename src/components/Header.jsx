import React, { useState } from 'react';
import { Search, ShoppingBag, User, Heart, X } from 'lucide-react';

export default function Header({
  cartCount,
  onOpenCart,
  onOpenOrders,
  wishlistCount,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  onScrollToStory,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const mainCategories = [
    { label: "Toutes les Collections", value: "Toutes nos catégories" },
    { label: "Outillage & Atelier", value: "Outillage & Soudure" },
    { label: "Circuits & Cartes", value: "Cartes Mères & Circuits" },
    { label: "Écrans & Dalles", value: "Écrans & Dalles" },
    { label: "Composants CMS", value: "Composants CMS & IC" },
  ];

  return (
    <>
      {/* Crown Cap Style Top Announcement Bar */}
      <div className="cc-announcement-bar">
        <span>
          LIVRAISON OFFERTE DÈS 30.000 FCFA &bull; SERVICE CLIENT D'EXCEPTION &bull; MAISON FONDÉE EN 1934
        </span>
      </div>

      {/* Main Header */}
      <header className="cc-header">
        <div className="cc-header-inner">
          {/* Left Navigation */}
          <nav className="cc-nav-left">
            {mainCategories.map((cat) => (
              <span
                key={cat.value}
                className={`cc-nav-link ${selectedCategory === cat.value && !searchQuery ? 'active' : ''}`}
                onClick={() => {
                  onSelectCategory(cat.value);
                  setSearchQuery('');
                }}
              >
                {cat.label}
              </span>
            ))}
            <span className="cc-nav-link" onClick={onScrollToStory}>
              Notre Histoire
            </span>
          </nav>

          {/* Center Logo with DevTech Software official logo */}
          <div
            className="cc-logo-wrap"
            onClick={() => {
              onSelectCategory('Toutes nos catégories');
              setSearchQuery('');
            }}
            title="DevTech Software | Accueil"
          >
            <img
              src="/img/devtech-logo.png"
              alt="DevTech Software"
              className="cc-logo-img"
            />
            <div className="cc-logo-sub">QUALITY CRAFTSMANSHIP & TECH &bull; EST. 1934</div>
          </div>

          {/* Right Action Icons */}
          <div className="cc-nav-right">
            {/* Search Toggle */}
            <button
              className="cc-icon-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Rechercher"
            >
              <Search size={18} strokeWidth={1.7} />
            </button>

            {/* Wishlist */}
            <button
              className="cc-icon-btn"
              onClick={onOpenWishlist}
              title="Vos Favoris"
            >
              <Heart
                size={18}
                strokeWidth={1.7}
                fill={wishlistCount > 0 ? "#ba4444" : "none"}
                color={wishlistCount > 0 ? "#ba4444" : "currentColor"}
              />
            </button>

            {/* Account / Orders */}
            <button
              className="cc-icon-btn"
              onClick={onOpenOrders}
              title="Vos Commandes"
            >
              <User size={18} strokeWidth={1.7} />
            </button>

            {/* Cart Button */}
            <button
              className="cc-icon-btn"
              onClick={onOpenCart}
              title="Panier d'achats"
            >
              <ShoppingBag size={18} strokeWidth={1.7} />
              {cartCount > 0 && <span className="cc-cart-indicator">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {isSearchOpen && (
          <div className="cc-search-drawer">
            <div className="cc-search-inner">
              <Search size={18} color="#6e7072" style={{ marginRight: 12 }} />
              <input
                type="text"
                className="cc-search-input"
                placeholder="Rechercher une pièce d'exception, un outil de précision..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7072', marginRight: 12 }}
                >
                  Effacer
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2026' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
