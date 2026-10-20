import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import EditorialStory from './components/EditorialStory';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import EditProductModal from './components/EditProductModal';
import { useAuth } from './context/AuthContext';

import { PRODUCTS } from './data/products';
import { getProducts, upsertProduct, insertOrder, getOrders } from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // ── Products state (éditable par le super admin & synchronisé Supabase) ────
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    getProducts().then((data) => {
      if (isMounted && data && data.length > 0) {
        setProducts(data);
      }
    });

    if (isSupabaseConfigured()) {
      getOrders().then((dbOrders) => {
        if (isMounted && dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes nos catégories');
  const [sortBy, setSortBy] = useState('featured');
  const [dealsOnly, setDealsOnly] = useState(false);

  const { currentUser, isLoggedIn, isSuperAdmin } = useAuth();
  const [loginNotice, setLoginNotice] = useState('');
  const [postLoginAction, setPostLoginAction] = useState(null); // 'cart' | 'checkout'

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const catalogRef = useRef(null);

  // Si l'utilisateur se déconnecte, fermer immédiatement le panier et le paiement
  useEffect(() => {
    if (!isLoggedIn()) {
      if (isCartOpen) setIsCartOpen(false);
      if (isCheckoutOpen) setIsCheckoutOpen(false);
    }
  }, [currentUser]);

  const categoriesList = [
    "Toutes nos catégories",
    "Outillage & Soudure",
    "Cartes Mères & Circuits",
    "Écrans & Dalles",
    "Composants CMS & IC",
    "Batteries & Alimentation",
    "Connectique & Nappes",
  ];

  // ── Protection d'accès au panier ──────────────────────────────────────────
  const handleOpenCart = () => {
    if (!isLoggedIn()) {
      setLoginNotice('Veuillez vous connecter à votre compte pour accéder à votre panier.');
      setPostLoginAction('cart');
      setIsLoginOpen(true);
      setToast({
        title: "Connexion requise",
        message: "Connectez-vous à votre compte pour accéder à votre panier.",
      });
      return;
    }
    setIsCartOpen(true);
  };

  // ── Protection de la finalisation du paiement ─────────────────────────────
  const handleOpenCheckout = () => {
    if (!isLoggedIn()) {
      setIsCartOpen(false);
      setLoginNotice('Veuillez vous connecter à votre compte pour finaliser votre paiement.');
      setPostLoginAction('checkout');
      setIsLoginOpen(true);
      setToast({
        title: "Connexion requise",
        message: "Connectez-vous pour finaliser votre paiement et confirmer la commande.",
      });
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // ── Action après connexion réussie ────────────────────────────────────────
  const handleLoginSuccess = () => {
    if (postLoginAction === 'cart') {
      setIsCartOpen(true);
    } else if (postLoginAction === 'checkout') {
      setIsCheckoutOpen(true);
    }
    setPostLoginAction(null);
    setLoginNotice('');
  };

  // Cart Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setToast({
      title: "Ajouté au panier",
      message: `${quantity}x ${product.title}`,
      showCartButton: true,
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleBuyNow = (product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    if (!isLoggedIn()) {
      setLoginNotice('Veuillez vous connecter à votre compte pour finaliser votre commande.');
      setPostLoginAction('checkout');
      setIsLoginOpen(true);
      setToast({
        title: "Connexion requise",
        message: "Connectez-vous pour finaliser votre commande.",
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        setToast({ title: "Retiré des favoris", message: product.title });
        return prev.filter((item) => item.id !== product.id);
      } else {
        setToast({ title: "Ajouté à votre liste d'envies", message: product.title });
        return [...prev, product];
      }
    });
  };

  const handleOrderSuccess = async (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    try {
      await insertOrder(newOrder);
    } catch (e) {
      console.error('Erreur sauvegarde commande Supabase:', e);
    }
  };

  // Handler de sauvegarde produit (super admin)
  const handleSaveProduct = async (productData) => {
    let finalProduct = { ...productData };
    const isNew = !finalProduct.id || finalProduct.isNew;
    if (isNew) {
      delete finalProduct.isNew;
      finalProduct.id = Date.now();
      setProducts((prev) => [finalProduct, ...prev]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === finalProduct.id ? finalProduct : p))
      );
    }
    setToast({
      title: isNew ? '✅ Nouveau produit créé' : '✅ Produit mis à jour',
      message: finalProduct.title,
    });
    setEditingProduct(null);
    try {
      await upsertProduct(finalProduct);
    } catch (e) {
      console.error('Erreur sauvegarde Supabase:', e);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'Toutes nos catégories' && p.category !== selectedCategory) {
        return false;
      }
      if (dealsOnly && !p.deal) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0; // Featured
    });
  }, [selectedCategory, dealsOnly, searchQuery, sortBy, products]);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('notre-histoire');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div>
      {/* 1. Crown Cap Luxury Header with DevTech Software Logo */}
      <Header
        cartCount={cartCount}
        onOpenCart={handleOpenCart}
        onOpenOrders={() => setIsOrdersOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => {
          setSelectedCategory('Toutes nos catégories');
          setSearchQuery('');
          scrollToCatalog();
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setDealsOnly(false);
          scrollToCatalog();
        }}
        onScrollToStory={scrollToStory}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsOrdersOpen(true)}
      />

      {/* 2. Editorial Hero & Trust Bar */}
      <HeroBanner
        onExploreCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onExploreDeals={() => {
          setDealsOnly(true);
          scrollToCatalog();
        }}
      />

      {/* 3. Catalog Section with Minimalist Filters */}
      <section ref={catalogRef} style={{ paddingTop: 20 }}>
        <div className="cc-section-header">
          <span className="cc-section-pretitle">
            COLLECTION OFFICIELLE &bull; DEVTECH SOFTWARE
          </span>
          <h2 className="cc-section-title">
            {searchQuery ? `Résultats pour "${searchQuery}"` : selectedCategory}
          </h2>
          <p className="cc-section-desc">
            Chaque référence est sélectionnée selon un cahier des charges rigoureux, testée sous banc d'essai et garantie 2 ans.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="cc-filter-nav">
          <div className="cc-category-pills">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`cc-pill ${selectedCategory === cat && !dealsOnly ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setDealsOnly(false);
                }}
              >
                {cat}
              </button>
            ))}

            <button
              className={`cc-pill ${dealsOnly ? 'active' : ''}`}
              style={{
                borderColor: dealsOnly ? '#ba4444' : '#e8e8e1',
                color: dealsOnly ? '#fff' : '#ba4444',
                backgroundColor: dealsOnly ? '#ba4444' : '#fff',
              }}
              onClick={() => setDealsOnly(!dealsOnly)}
            >
              Éditions Soldées
            </button>
          </div>

          <div className="cc-filter-meta">
            {isSuperAdmin() && (
              <button
                className="cc-pill"
                style={{
                  backgroundColor: '#007185',
                  color: '#fff',
                  borderColor: '#007185',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() =>
                  setEditingProduct({
                    isNew: true,
                    category: 'Outillage & Soudure',
                    price: '',
                    stock: 10,
                    features: [],
                  })
                }
              >
                + Nouveau Produit
              </button>
            )}

            <span style={{ color: '#6e7072', fontSize: 13 }}>
              <strong>{filteredProducts.length}</strong> modèles disponibles
            </span>

            <select
              className="cc-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">En Vedette</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name">Alphabétique (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="cc-product-grid-container">
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 20px', border: '1px dashed #d1d5db', backgroundColor: '#fafafa', borderRadius: 4 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#1f2026', marginBottom: 10 }}>
                Base de données vierge & prête
              </h3>
              <p style={{ fontSize: 13, color: '#6e7072', maxWidth: 480, margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                Aucune donnée fictive n'est chargée. Vous pouvez commencer à saisir vos propres articles réels dès maintenant.
              </p>
              {isSuperAdmin() ? (
                <button
                  className="cc-btn cc-btn-primary"
                  onClick={() =>
                    setEditingProduct({
                      isNew: true,
                      category: 'Outillage & Soudure',
                      price: '',
                      stock: 10,
                      features: [],
                    })
                  }
                >
                  + Ajouter un premier produit
                </button>
              ) : (
                <p style={{ fontSize: 12, color: '#888' }}>
                  Connectez-vous en Super Administrateur pour ajouter vos premiers produits.
                </p>
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px solid #e8e8e1', backgroundColor: '#f9f9fb' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#1f2026', marginBottom: 10 }}>
                Aucune référence ne correspond à votre recherche
              </h3>
              <p style={{ fontSize: 13, color: '#6e7072', marginBottom: 20 }}>
                Modifiez vos filtres ou explorez l'ensemble de notre catalogue.
              </p>
              <button
                className="cc-btn cc-btn-primary"
                onClick={() => {
                  setSelectedCategory('Toutes nos catégories');
                  setSearchQuery('');
                  setDealsOnly(false);
                }}
              >
                Réinitialiser la sélection
              </button>
            </div>
          ) : (
            <div className="cc-product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onEditProduct={(p) => setEditingProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Heritage Storytelling Section */}
      <EditorialStory onExplore={scrollToCatalog} />

      {/* 5. Luxury Footer with DevTech Logo */}
      <Footer onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* 6. Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlist.some(item => item.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onOpenCart={() => {
          setToast(null);
          handleOpenCart();
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setLoginNotice('');
          setPostLoginAction(null);
        }}
        notice={loginNotice}
        onSuccess={handleLoginSuccess}
      />

      {/* Edit Product Modal (Super Admin only) */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
