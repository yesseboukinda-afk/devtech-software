import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, Heart, X, LogOut, Settings, Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  onOpenLogin,
  onOpenAdmin,
}) {
  const { currentUser, logout, isSuperAdmin, isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

            {/* Account / Login */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              {currentUser ? (
                <>
                  <button
                    className="cc-icon-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    title={currentUser.name}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 3 }}
                  >
                    {currentUser.photo ? (
                      <img
                        src={currentUser.photo}
                        alt={currentUser.name}
                        style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 0 }}
                      />
                    ) : (
                      <span style={{ fontSize: 16 }}>{currentUser.avatar || '👤'}</span>
                    )}
                    {isSuperAdmin() && <Crown size={12} color="#f59e0b" style={{ position: 'absolute', top: 2, right: 2 }} />}
                  </button>

                  {showUserMenu && (
                    <div style={{
                      position: 'absolute', right: 0, top: '110%', background: '#fff',
                      borderRadius: 0, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                      border: '1px solid #e8e8e1', minWidth: 260, zIndex: 9999,
                      animation: 'slideUp 0.18s ease', overflow: 'hidden',
                    }}>
                      {/* Profil */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', background: isSuperAdmin() ? '#fffbeb' : isAdmin() ? '#eff6ff' : '#f9f9fb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {currentUser.photo ? (
                            <img
                              src={currentUser.photo}
                              alt={currentUser.name}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 0, border: '1px solid #ccc' }}
                            />
                          ) : (
                            <span style={{ fontSize: 26 }}>{currentUser.avatar || '👤'}</span>
                          )}
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2026', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {currentUser.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {currentUser.email}
                            </div>
                          </div>
                        </div>

                        {/* Coordonnées détaillées & Pièce d'identité */}
                        {(currentUser.phone || currentUser.city || currentUser.district || currentUser.idNumber) && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e2e8f0', fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
                            {currentUser.phone && <div>📞 {currentUser.phone}</div>}
                            {(currentUser.city || currentUser.district) && (
                              <div>📍 {currentUser.district ? `${currentUser.district}, ` : ''}{currentUser.city || ''}</div>
                            )}
                            {currentUser.idNumber && (
                              <div style={{ color: '#047857', fontWeight: 600 }}>🪪 CNI/Passeport : {currentUser.idNumber}</div>
                            )}
                          </div>
                        )}

                        <div style={{ marginTop: 8 }}>
                          {isSuperAdmin() && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: '#f59e0b', color: '#fff', borderRadius: 0, padding: '2px 7px', letterSpacing: 0.5 }}>
                              👑 SUPER ADMIN
                            </span>
                          )}
                          {!isSuperAdmin() && isAdmin() && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: '#3b82f6', color: '#fff', borderRadius: 0, padding: '2px 7px', letterSpacing: 0.5 }}>
                              🛠️ ADMIN
                            </span>
                          )}
                          {currentUser.role === 'user' && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: '#10b981', color: '#fff', borderRadius: 0, padding: '2px 7px', letterSpacing: 0.5 }}>
                              CLIENT DEVTECH
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mes commandes */}
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenOrders(); }}
                        style={menuItemStyle}
                      >
                        <User size={14} /> Mes commandes
                      </button>

                      {/* Dashboard admin */}
                      {isAdmin() && (
                        <button
                          onClick={() => { setShowUserMenu(false); onOpenAdmin(); }}
                          style={{ ...menuItemStyle, color: '#3b82f6' }}
                        >
                          <Settings size={14} /> Tableau de bord admin
                        </button>
                      )}

                      <div style={{ height: 1, background: '#f0f0f0' }} />

                      {/* Déconnexion */}
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        style={{ ...menuItemStyle, color: '#ba4444' }}
                      >
                        <LogOut size={14} /> Se déconnecter
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="cc-icon-btn"
                  onClick={onOpenLogin}
                  title="Se connecter"
                >
                  <User size={18} strokeWidth={1.7} />
                </button>
              )}
            </div>

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

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
  padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 500, color: '#1f2026', textAlign: 'left',
  transition: 'background 0.15s',
};
