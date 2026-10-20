import React, { useState } from 'react';
import { X, Save, Trash2, Plus, Image, Tag, Package, Star, AlertCircle, Camera, Check } from 'lucide-react';

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(product ? { ...product } : {});
  const [featureInput, setFeatureInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Sync when product changes
  React.useEffect(() => {
    if (product) {
      const imagesList = product.images && product.images.length > 0
        ? [...product.images]
        : (product.image ? [product.image] : []);
      setForm({ ...product, images: imagesList });
      setError('');
      setSaved(false);
      setNewImageUrl('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setForm((prev) => ({ ...prev, features: [...(prev.features || []), featureInput.trim()] }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  // ── Gestion de la galerie multi-photos ──────────────────────────────────
  const handleAddImageByUrl = () => {
    if (!newImageUrl.trim()) return;
    const currentImages = form.images || (form.image ? [form.image] : []);
    const updated = [...currentImages, newImageUrl.trim()];
    setForm((prev) => ({
      ...prev,
      images: updated,
      image: prev.image || updated[0],
    }));
    setNewImageUrl('');
  };

  const handleUploadImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const currentImages = form.images || (form.image ? [form.image] : []);
      const updated = [...currentImages, dataUrl];
      setForm((prev) => ({
        ...prev,
        images: updated,
        image: prev.image || updated[0],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const currentImages = form.images || [];
    const updated = currentImages.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      images: updated,
      image: updated[0] || '',
    }));
  };

  const handleSetPrimaryImage = (index) => {
    const currentImages = form.images || [];
    const selected = currentImages[index];
    if (!selected) return;
    const updated = [selected, ...currentImages.filter((_, i) => i !== index)];
    setForm((prev) => ({
      ...prev,
      images: updated,
      image: selected,
    }));
  };

  const handleSave = () => {
    if (!form.title?.trim()) return setError('Le titre est obligatoire.');
    if (!form.price || isNaN(form.price)) return setError('Prix invalide.');

    const finalImages = form.images && form.images.length > 0 ? form.images : (form.image ? [form.image] : []);
    onSave({
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      images: finalImages,
      image: finalImages[0] || form.image,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000, alignItems: 'flex-start', paddingTop: 30 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 0,
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 2 }}>
              ✏️ {form.isNew || !form.id ? 'Nouveau Produit' : 'Édition Super Admin'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#1f2026', margin: 0 }}>
              {form.isNew || !form.id ? 'Ajouter un Nouveau Produit' : `Modifier le Produit #${form.id}`}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 0, padding: '10px 14px', marginBottom: 16, color: '#991b1b', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {saved && (
          <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 0, padding: '10px 14px', marginBottom: 16, color: '#065f46', fontSize: 13, fontWeight: 700 }}>
            ✅ Produit mis à jour avec succès !
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          {/* Titre */}
          <Field label="Titre du produit" icon={<Tag size={14} />}>
            <textarea
              value={form.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              rows={2}
              style={textareaStyle}
            />
          </Field>

          {/* Marque + Catégorie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Marque / Brand">
              <input value={form.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Catégorie">
              <select value={form.category || ''} onChange={(e) => handleChange('category', e.target.value)} style={inputStyle}>
                {['Outillage & Soudure', 'Cartes Mères & Circuits', 'Écrans & Dalles', 'Composants CMS & IC', 'Batteries & Alimentation', 'Connectique & Nappes'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Prix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Prix (FCFA)">
              <input type="number" value={form.price || ''} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Ancien Prix (FCFA)">
              <input type="number" value={form.oldPrice || ''} onChange={(e) => handleChange('oldPrice', e.target.value)} style={inputStyle} placeholder="Optionnel" />
            </Field>
            <Field label="Remise (%)">
              <input type="number" value={form.dealDiscount || ''} onChange={(e) => handleChange('dealDiscount', e.target.value)} style={inputStyle} placeholder="Ex: 25" />
            </Field>
          </div>

          {/* ── Galerie Multi-Photos de l'article ── */}
          <Field label="Galerie Photos du Produit (Multi-photos)" icon={<Image size={14} />}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageByUrl())}
                placeholder="Ajouter l'URL d'une photo (https://...)"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddImageByUrl}
                style={{ padding: '8px 14px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
              >
                <Plus size={14} />
              </button>
              <label
                style={{
                  padding: '8px 14px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                <Camera size={14} />
                <span>Importer</span>
                <input type="file" accept="image/*" onChange={handleUploadImageFile} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Liste des photos avec aperçus */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {(form.images || []).map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    border: idx === 0 ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                    background: '#f8fafc',
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${idx + 1}`}
                    style={{ width: '100%', height: 75, objectFit: 'contain', background: '#fff' }}
                  />
                  {idx === 0 && (
                    <span style={{ position: 'absolute', top: 4, left: 4, background: 'var(--color-primary)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 4px' }}>
                      Principale
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, width: '100%' }}>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Définir comme principale"
                        style={{ flex: 1, padding: '2px 0', fontSize: 10, background: '#e2e8f0', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mettre 1ère
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Supprimer cette photo"
                      style={{ padding: '2px 6px', fontSize: 10, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Field>

          {/* SKU + Stock + Note */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="SKU">
              <input value={form.sku || ''} onChange={(e) => handleChange('sku', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Stock">
              <input type="number" value={form.stock || ''} onChange={(e) => handleChange('stock', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Note (/5)" icon={<Star size={13} />}>
              <input type="number" step="0.1" min="0" max="5" value={form.rating || ''} onChange={(e) => handleChange('rating', e.target.value)} style={inputStyle} />
            </Field>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'deal', label: '🔥 Solde actif' },
              { key: 'bestSeller', label: '⭐ Best Seller' },
              { key: 'prime', label: '✈️ Prime' },
              { key: 'amazonChoice', label: '🏅 Choix du site' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={!!form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>

          {/* Garantie + Livraison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Garantie">
              <input value={form.warranty || ''} onChange={(e) => handleChange('warranty', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Info livraison">
              <input value={form.deliveryDate || ''} onChange={(e) => handleChange('deliveryDate', e.target.value)} style={inputStyle} />
            </Field>
          </div>

          {/* Caractéristiques */}
          <Field label="Caractéristiques clés" icon={<Package size={14} />}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Ajouter une caractéristique (Entrée pour valider)"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                style={{ padding: '8px 14px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer' }}
              >
                <Plus size={14} />
              </button>
            </div>
            {(form.features || []).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: '#f9f9fb', borderRadius: 0, marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>•</span>
                <span style={{ flex: 1 }}>{f}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba4444', padding: 0 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </Field>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'none', border: '1px solid #ddd', borderRadius: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ padding: '10px 24px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Save size={15} /> Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 0,
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};
