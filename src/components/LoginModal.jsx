import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Phone,
  MapPin,
  Globe,
  Map,
  Compass,
  Camera,
  Trash2,
  CreditCard,
  FileText,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, notice, onSuccess }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'Gabon',
    province: 'Estuaire',
    city: 'Libreville',
    district: '',
    photo: '',
    idNumber: '',
    idCardRecto: '',
    idCardVerso: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // ── Upload Photo Profil ──────────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 260;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setForm((prev) => ({ ...prev, photo: dataUrl }));
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, photo: '' }));
  };

  // ── Upload Pièce d'Identité (Recto / Verso) ──────────────────────────────
  const handleIdCardUpload = (side, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (PNG, JPG, JPEG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 8 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 650;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setForm((prev) => ({
          ...prev,
          [side === 'recto' ? 'idCardRecto' : 'idCardVerso']: dataUrl,
        }));
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIdCard = (side) => {
    setForm((prev) => ({
      ...prev,
      [side === 'recto' ? 'idCardRecto' : 'idCardVerso']: '',
    }));
  };

  // ── Soumission Connexion ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setError('Veuillez renseigner votre email ou téléphone et votre mot de passe.');
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      setLoading(false);
      if (result.success) {
        setSuccess(`Bienvenue, ${result.user.name} ${result.user.avatar}`);
        setTimeout(() => {
          onClose();
          setSuccess('');
          if (onSuccess) onSuccess(result.user);
        }, 1000);
      } else {
        setError(result.error);
      }
    }, 600);
  };

  // ── Soumission Inscription ────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return setError('Le nom, l’email et le mot de passe sont obligatoires.');
    }
    if (!form.phone.trim()) {
      return setError('Veuillez renseigner votre numéro de téléphone.');
    }
    if (!form.city.trim() || !form.district.trim()) {
      return setError('Veuillez préciser votre ville et votre quartier.');
    }
    if (!form.idNumber.trim()) {
      return setError('Veuillez renseigner le numéro de votre pièce d’identité.');
    }
    if (!form.idCardRecto || !form.idCardVerso) {
      return setError('Veuillez importer les photos Recto et Verso de votre pièce d’identité.');
    }
    if (form.password.length < 6) {
      return setError('Le mot de passe doit faire au moins 6 caractères.');
    }

    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        country: form.country,
        province: form.province,
        city: form.city,
        district: form.district,
        photo: form.photo,
        idNumber: form.idNumber,
        idCardRecto: form.idCardRecto,
        idCardVerso: form.idCardVerso,
      });
      setLoading(false);
      if (result.success) {
        setSuccess(`Compte créé avec succès ! Bienvenue, ${result.user.name} 🎉`);
        setTimeout(() => {
          onClose();
          setSuccess('');
          if (onSuccess) onSuccess(result.user);
        }, 1000);
      } else {
        setError(result.error);
      }
    }, 600);
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSuccess('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className={`login-modal login-modal--${tab}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: tab === 'register' ? 'min(620px, 100vw)' : 'min(420px, 100vw)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/img/devtech-logo.png" alt="DevTech" style={{ height: 40, objectFit: 'contain' }} />
          <div style={{ fontSize: 11, color: '#888', marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Espace Client &bull; DevTech Software
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: 20 }}>
          {[
            { key: 'login', label: 'Se connecter', icon: <LogIn size={14} /> },
            { key: 'register', label: 'Créer un compte', icon: <UserPlus size={14} /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? 'var(--color-primary)' : '#888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Notice Info */}
        {notice && !success && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderLeft: '4px solid var(--color-primary)',
            borderRadius: 0,
            padding: '10px 14px',
            marginBottom: 16,
            color: '#1e293b',
            fontSize: 12.5,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Lock size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span>{notice}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 0, padding: '10px 14px', marginBottom: 16, color: '#065f46', fontSize: 13, fontWeight: 600 }}>
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 0, padding: '10px 14px', marginBottom: 16, color: '#991b1b', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
          {tab === 'register' && (
            <>
              {/* Photo Upload Area */}
              <div style={{ marginBottom: 18, padding: 14, background: '#fafafa', border: '1px dashed #d1d5db', borderRadius: 0 }}>
                <label style={{ ...labelStyle, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Photo de profil</span>
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>Optionnelle</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      background: '#fff',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {form.photo ? (
                      <img src={form.photo} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={22} color="#aaa" />
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        padding: '7px 12px',
                        background: '#fff',
                        border: '1px solid #1f2026',
                        borderRadius: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#1f2026',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Camera size={13} />
                      <span>{form.photo ? 'Changer la photo' : 'Ajouter une photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {form.photo && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        style={{
                          padding: '7px 10px',
                          background: '#fff',
                          border: '1px solid #fca5a5',
                          borderRadius: 0,
                          fontSize: 12,
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Supprimer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nom complet */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nom complet *</label>
                <div style={inputWrap}>
                  <User size={15} color="#aaa" style={{ flexShrink: 0 }} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex: Jean-Marc Ondo"
                    style={inputStyle}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Téléphone & Pays */}
              <div className="login-two-cols" style={{ gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Numéro de téléphone *</label>
                  <div style={inputWrap}>
                    <Phone size={15} color="#aaa" style={{ flexShrink: 0 }} />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+241 07 00 00 00"
                      style={inputStyle}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Pays *</label>
                  <div style={inputWrap}>
                    <Globe size={15} color="#aaa" style={{ flexShrink: 0 }} />
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Gabon"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Province & Ville */}
              <div className="login-two-cols" style={{ gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Province *</label>
                  <div style={inputWrap}>
                    <Map size={15} color="#aaa" style={{ flexShrink: 0 }} />
                    <input
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      placeholder="Ex: Estuaire"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ville *</label>
                  <div style={inputWrap}>
                    <MapPin size={15} color="#aaa" style={{ flexShrink: 0 }} />
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Ex: Libreville"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Quartier */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Quartier *</label>
                <div style={inputWrap}>
                  <Compass size={15} color="#aaa" style={{ flexShrink: 0 }} />
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Ex: Glass, Louis, Akébé, Plein-Ciel..."
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* ── SECTION PIÈCE D'IDENTITÉ (N°, RECTO, VERSO) ── */}
              <div
                style={{
                  marginBottom: 20,
                  padding: 16,
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <CreditCard size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Pièce d'Identité Officielle (CNI / Passeport)
                  </span>
                </div>

                {/* Numéro de la pièce d'identité */}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Numéro de la pièce d'identité *</label>
                  <div style={{ ...inputWrap, background: '#fff' }}>
                    <FileText size={15} color="#aaa" style={{ flexShrink: 0 }} />
                    <input
                      name="idNumber"
                      value={form.idNumber}
                      onChange={handleChange}
                      placeholder="Ex: CNI N° GA-198420-B ou N° Passeport"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Recto & Verso Upload Grid */}
                <div className="login-two-cols" style={{ gap: 12 }}>
                  {/* RECTO */}
                  <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Photo Recto *</span>
                      {form.idCardRecto && <CheckCircle size={13} color="#10b981" />}
                    </label>
                    <div
                      style={{
                        height: 110,
                        border: form.idCardRecto ? '1.5px solid #10b981' : '1.5px dashed #cbd5e1',
                        background: '#ffffff',
                        borderRadius: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {form.idCardRecto ? (
                        <>
                          <img
                            src={form.idCardRecto}
                            alt="Recto CNI"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveIdCard('recto')}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: '#fff',
                              border: 'none',
                              padding: 3,
                              cursor: 'pointer',
                            }}
                            title="Supprimer le recto"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <label
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: 8,
                            width: '100%',
                          }}
                        >
                          <Upload size={18} color="#64748b" />
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>
                            Charger le RECTO
                          </span>
                          <span style={{ fontSize: 9.5, color: '#94a3b8' }}>Face avant avec photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleIdCardUpload('recto', e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* VERSO */}
                  <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Photo Verso *</span>
                      {form.idCardVerso && <CheckCircle size={13} color="#10b981" />}
                    </label>
                    <div
                      style={{
                        height: 110,
                        border: form.idCardVerso ? '1.5px solid #10b981' : '1.5px dashed #cbd5e1',
                        background: '#ffffff',
                        borderRadius: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {form.idCardVerso ? (
                        <>
                          <img
                            src={form.idCardVerso}
                            alt="Verso CNI"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveIdCard('verso')}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: '#fff',
                              border: 'none',
                              padding: 3,
                              cursor: 'pointer',
                            }}
                            title="Supprimer le verso"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <label
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: 8,
                            width: '100%',
                          }}
                        >
                          <Upload size={18} color="#64748b" />
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>
                            Charger le VERSO
                          </span>
                          <span style={{ fontSize: 9.5, color: '#94a3b8' }}>Face arrière avec puce/code</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleIdCardUpload('verso', e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 10, lineHeight: 1.4 }}>
                  🔒 Documents chiffrés et vérifiés pour la validation légale de votre compte et de vos commandes.
                </div>
              </div>
            </>
          )}

          {/* Email ou Téléphone */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>
              {tab === 'login' ? 'Email ou Numéro de téléphone *' : 'Adresse email *'}
            </label>
            <div style={inputWrap}>
              {tab === 'login' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#aaa', flexShrink: 0 }}>
                  <Mail size={14} />
                  <span style={{ fontSize: 11, color: '#ccc' }}>/</span>
                  <Phone size={13} />
                </div>
              ) : (
                <Mail size={15} color="#aaa" style={{ flexShrink: 0 }} />
              )}
              <input
                name="email"
                type={tab === 'login' ? 'text' : 'email'}
                value={form.email}
                onChange={handleChange}
                placeholder={tab === 'login' ? 'email@exemple.com ou +241 07 00 00 00' : 'email@exemple.com'}
                style={inputStyle}
                autoComplete={tab === 'login' ? 'username' : 'email'}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Mot de passe *</label>
            <div style={inputWrap}>
              <Lock size={15} color="#aaa" style={{ flexShrink: 0 }} />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder={tab === 'register' ? 'Min. 6 caractères' : '••••••••'}
                style={{ ...inputStyle, flex: 1 }}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 0',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              letterSpacing: 0.5,
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? '...' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#444',
  marginBottom: 6,
  letterSpacing: 0.3,
};
const inputWrap = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  border: '1.5px solid #e0e0e0',
  borderRadius: 0,
  padding: '10px 12px',
  background: '#fafafa',
  transition: 'border-color 0.2s',
  width: '100%',
  boxSizing: 'border-box',
};
const inputStyle = {
  flex: 1,
  minWidth: 0,
  width: '100%',
  background: 'none',
  border: 'none',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: '#1f2026',
};
