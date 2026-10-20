import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPERADMIN_EMAILS = ['yesseboukinda@gmail.com', 'superadmin@devtech.ga'];
export const SUPERADMIN_PHONES = ['077058307', '241077058307', '77058307', '24177058307', '07 70 58 307'];

export const normalizePhone = (p) => (p || '').replace(/[\s\-\.\(\)\+]/g, '');
export const stripPhoneCountryAndZero = (p) => {
  let clean = normalizePhone(p);
  if (clean.startsWith('241')) clean = clean.slice(3);
  return clean.replace(/^0+/, '');
};

export const isSuperAdminIdentity = (user) => {
  if (!user) return false;
  if (user.role === 'superadmin') return true;
  if (user.email && SUPERADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  if (
    user.phone &&
    (SUPERADMIN_PHONES.includes(normalizePhone(user.phone)) ||
      stripPhoneCountryAndZero(user.phone) === '77058307')
  ) {
    return true;
  }
  return false;
};

// ─── Comptes privilégiés (hardcodés) ────────────────────────────────────────
const PRIVILEGED_ACCOUNTS = [
  {
    id: 'sa-001',
    email: 'yesseboukinda@gmail.com',
    password: 'Red_link13',
    name: 'Yesse Boukinda (Super Admin)',
    role: 'superadmin',
    avatar: '👑',
    photo: '',
    phone: '+241 07 70 58 307',
    country: 'Gabon',
    province: 'Estuaire',
    city: 'Libreville',
    district: 'Centre-Ville',
    idNumber: 'GA-CNI-001934',
    idCardRecto: '',
    idCardVerso: '',
  },
  {
    id: 'sa-002',
    email: 'superadmin@devtech.ga',
    password: 'Red_link13',
    name: 'Super Administrateur',
    role: 'superadmin',
    avatar: '👑',
    photo: '',
    phone: '+241 07 70 58 307',
    country: 'Gabon',
    province: 'Estuaire',
    city: 'Libreville',
    district: 'Centre-Ville',
    idNumber: 'GA-CNI-001934',
    idCardRecto: '',
    idCardVerso: '',
  },
  {
    id: 'adm-001',
    email: 'admin@devtech.ga',
    password: 'Red_link13',
    name: 'Administrateur',
    role: 'admin',
    avatar: '🛠️',
    photo: '',
    phone: '+241 06 20 18 90',
    country: 'Gabon',
    province: 'Estuaire',
    city: 'Libreville',
    district: 'Glass',
    idNumber: 'GA-CNI-008421',
    idCardRecto: '',
    idCardVerso: '',
  },
];

const USERS_KEY = 'devtech_users';
const SESSION_KEY = 'devtech_session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charge la session sauvegardée au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        if (isSuperAdminIdentity(user)) {
          user.role = 'superadmin';
          user.avatar = user.photo || '👑';
        }
        setCurrentUser(user);
      }
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Récupère les users enregistrés ─────────────────────────────────────
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const matchesIdentifier = (user, input) => {
    if (!input) return false;
    const rawInput = input.trim();
    const inputLower = rawInput.toLowerCase();

    // 1. Match par email
    if (user.email && user.email.toLowerCase() === inputLower) return true;

    // 2. Match par téléphone (ex: 077058307, +241 07 70 58 307, 77058307)
    if (user.phone) {
      const userPhoneClean = normalizePhone(user.phone);
      const inputClean = normalizePhone(rawInput);
      if (userPhoneClean.length >= 6 && inputClean.length >= 6) {
        if (userPhoneClean === inputClean) return true;
        if (userPhoneClean.endsWith(inputClean) || inputClean.endsWith(userPhoneClean)) {
          return true;
        }
        if (stripPhoneCountryAndZero(user.phone) === stripPhoneCountryAndZero(rawInput)) {
          return true;
        }
      }
    }
    return false;
  };

  // ─── Connexion (par Email ou Téléphone) ────────────────────────────────────
  const login = (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, error: 'Veuillez saisir votre email ou téléphone et mot de passe.' };
    }

    // Vérifie les comptes privilégiés
    const privileged = PRIVILEGED_ACCOUNTS.find(
      (a) => matchesIdentifier(a, identifier) && a.password === password
    );
    if (privileged) {
      const { password: _, ...safeUser } = privileged;
      if (isSuperAdminIdentity(safeUser)) {
        safeUser.role = 'superadmin';
        safeUser.avatar = safeUser.photo || '👑';
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }

    // Vérifie les users enregistrés
    const users = getRegisteredUsers();
    const found = users.find(
      (u) => matchesIdentifier(u, identifier) && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      if (isSuperAdminIdentity(safeUser)) {
        safeUser.role = 'superadmin';
        safeUser.avatar = safeUser.photo || '👑';
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }

    return { success: false, error: 'Email/Téléphone ou mot de passe incorrect.' };
  };

  // ─── Inscription ──────────────────────────────────────────────────────────
  const register = (registrationData, maybeEmail, maybePassword) => {
    let data = {};
    if (typeof registrationData === 'object' && registrationData !== null) {
      data = registrationData;
    } else {
      data = {
        name: registrationData,
        email: maybeEmail,
        password: maybePassword,
      };
    }

    const {
      name = '',
      email = '',
      password = '',
      phone = '',
      country = 'Gabon',
      province = '',
      city = '',
      district = '',
      photo = '',
      idNumber = '',
      idCardRecto = '',
      idCardVerso = '',
    } = data;

    const normalized = email.trim().toLowerCase();
    const isSuperAdminEmail = SUPERADMIN_EMAILS.includes(normalized);

    // Vérifie si l'email est déjà pris (sauf pour le Super Admin qui peut créer/mettre à jour son mot de passe personnalisé)
    if (!isSuperAdminEmail) {
      const isPrivileged = PRIVILEGED_ACCOUNTS.some((a) => a.email === normalized);
      if (isPrivileged) {
        return { success: false, error: 'Cet email est déjà utilisé.' };
      }

      const users = getRegisteredUsers();
      const exists = users.some((u) => u.email === normalized);
      if (exists) {
        return { success: false, error: 'Un compte existe déjà avec cet email.' };
      }
    }

    const users = getRegisteredUsers().filter((u) => u.email !== normalized);

    // Vérifie si le numéro de téléphone est déjà pris
    if (phone.trim() && !isSuperAdminEmail) {
      const cleanNewPhone = normalizePhone(phone);
      if (cleanNewPhone.length >= 6) {
        const phoneTaken = users.some(
          (u) => u.phone && normalizePhone(u.phone) === cleanNewPhone
        );
        if (phoneTaken) {
          return { success: false, error: 'Un compte existe déjà avec ce numéro de téléphone.' };
        }
      }
    }

    const newUser = {
      id: isSuperAdminEmail ? 'sa-001' : `user-${Date.now()}`,
      email: normalized,
      password,
      name: name.trim() || (isSuperAdminEmail ? 'Yesse Boukinda (Super Admin)' : ''),
      phone: phone.trim() || (isSuperAdminEmail ? '+241 07 70 58 307' : ''),
      country: country.trim() || 'Gabon',
      province: province.trim() || 'Estuaire',
      city: city.trim() || 'Libreville',
      district: district.trim() || 'Centre-Ville',
      photo: photo || '',
      avatar: photo || (isSuperAdminEmail ? '👑' : '👤'),
      idNumber: idNumber.trim() || (isSuperAdminEmail ? 'GA-CNI-001934' : ''),
      idCardRecto: idCardRecto || '',
      idCardVerso: idCardVerso || '',
      role: isSuperAdminEmail ? 'superadmin' : 'user',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  };

  // ─── Déconnexion ──────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  // ─── Helpers de rôle ─────────────────────────────────────────────────────
  const isSuperAdmin = () => isSuperAdminIdentity(currentUser);

  const isAdmin = () => isSuperAdmin() || currentUser?.role === 'admin';
  const isLoggedIn = () => !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        register,
        isSuperAdmin,
        isAdmin,
        isLoggedIn,
        getRegisteredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
