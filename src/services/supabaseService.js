import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS } from '../data/products';

// Helper pour convertir un enregistrement Supabase snake_case vers le format attendu par les composants React
function formatProductFromDb(row) {
  return {
    id: Number(row.id),
    title: row.title || '',
    brand: row.brand || '',
    category: row.category || '',
    image: row.image || '',
    images: Array.isArray(row.images) ? row.images : (row.image ? [row.image] : []),
    price: Number(row.price) || 0,
    oldPrice: row.old_price !== null ? Number(row.old_price) : undefined,
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviews_count) || 0,
    boughtPastMonth: row.bought_past_month || '',
    prime: Boolean(row.prime),
    amazonChoice: Boolean(row.amazon_choice),
    bestSeller: Boolean(row.best_seller),
    deal: Boolean(row.deal),
    dealDiscount: Number(row.deal_discount) || 0,
    stock: Number(row.stock) || 0,
    features: Array.isArray(row.features) ? row.features : [],
    sku: row.sku || '',
    warranty: row.warranty || '',
    deliveryDate: row.delivery_date || '',
  };
}

// Helper pour convertir un produit React vers les colonnes SQL Supabase
function formatProductToDb(p) {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand || null,
    category: p.category,
    image: p.image || null,
    images: p.images || (p.image ? [p.image] : []),
    price: p.price,
    old_price: p.oldPrice !== undefined ? p.oldPrice : null,
    rating: p.rating || 5.0,
    reviews_count: p.reviewsCount || 0,
    bought_past_month: p.boughtPastMonth || null,
    prime: Boolean(p.prime),
    amazon_choice: Boolean(p.amazonChoice),
    best_seller: Boolean(p.bestSeller),
    deal: Boolean(p.deal),
    deal_discount: p.dealDiscount || 0,
    stock: p.stock || 0,
    features: p.features || [],
    sku: p.sku || null,
    warranty: p.warranty || null,
    delivery_date: p.deliveryDate || null,
  };
}

/**
 * Récupère tous les produits.
 * Si Supabase est connecté, interroge la table 'products'.
 * Sinon, retourne les produits locaux par défaut.
 */
export async function getProducts() {
  if (!isSupabaseConfigured() || !supabase) {
    return PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('[Supabase] Erreur récupération produits, fallback local :', error.message);
      return PRODUCTS;
    }

    if (!data || data.length === 0) {
      return PRODUCTS;
    }

    return data.map(formatProductFromDb);
  } catch (err) {
    console.error('[Supabase] Exception getProducts :', err);
    return PRODUCTS;
  }
}

/**
 * Enregistre ou met à jour un produit dans Supabase.
 */
export async function upsertProduct(product) {
  if (!isSupabaseConfigured() || !supabase) {
    return product;
  }

  try {
    const payload = formatProductToDb(product);
    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Erreur upsert produit :', error.message);
      throw error;
    }

    return formatProductFromDb(data);
  } catch (err) {
    console.error('[Supabase] Exception upsertProduct :', err);
    throw err;
  }
}

/**
 * Supprime un produit dans Supabase.
 */
export async function deleteProduct(productId) {
  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('[Supabase] Erreur suppression produit :', error.message);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Exception deleteProduct :', err);
    throw err;
  }
}

/**
 * Enregistre une commande dans Supabase.
 */
export async function insertOrder(order) {
  if (!isSupabaseConfigured() || !supabase) {
    return order;
  }

  try {
    const payload = {
      id: order.orderId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      delivery_address: order.address,
      payment_method: order.paymentMethod,
      items: order.items,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee || 0,
      total: order.total,
      status: order.status || 'En attente de traitement',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Erreur insertion commande :', error.message);
      return order;
    }

    return {
      orderId: data.id,
      date: new Date(data.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      address: data.delivery_address,
      paymentMethod: data.payment_method,
      items: data.items,
      subtotal: Number(data.subtotal),
      shippingFee: Number(data.shipping_fee),
      total: Number(data.total),
      status: data.status,
    };
  } catch (err) {
    console.error('[Supabase] Exception insertOrder :', err);
    return order;
  }
}

/**
 * Récupère les commandes depuis Supabase.
 */
export async function getOrders() {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Erreur récupération commandes :', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      orderId: row.id,
      date: new Date(row.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      address: row.delivery_address,
      paymentMethod: row.payment_method,
      items: row.items,
      subtotal: Number(row.subtotal),
      shippingFee: Number(row.shipping_fee),
      total: Number(row.total),
      status: row.status,
    }));
  } catch (err) {
    console.error('[Supabase] Exception getOrders :', err);
    return [];
  }
}
