import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Comptes privilégiés (hardcodés) ────────────────────────────────────────
const PRIVILEGED_ACCOUNTS = [
  {
    id: 'sa-001',
    email: 'superadmin@devtech.ga',
    password: 'DevTech@2024!',
    name: 'Super Administrateur',
    role: 'superadmin',
    avatar: '👑',
    photo: '',
    phone: '+241 07 45 12 30',
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
    password: 'Admin@2024!',
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

  // ─── Helpers de normalisation ─────────────────────────────────────────────
  const normalizePhone = (p) => (p || '').replace(/[\s\-\.\(\)\+]/g, '');

  const matchesIdentifier = (user, input) => {
    if (!input) return false;
    const rawInput = input.trim();
    const inputLower = rawInput.toLowerCase();

    // 1. Match par email
    if (user.email && user.email.toLowerCase() === inputLower) return true;

    // 2. Match par téléphone
    if (user.phone) {
      const userPhoneClean = normalizePhone(user.phone);
      const inputClean = normalizePhone(rawInput);
      if (userPhoneClean.length >= 6 && inputClean.length >= 6) {
        if (userPhoneClean === inputClean) return true;
        // Permet de matcher sans indicatif local (ex: 07451230 vs 24107451230)
        if (userPhoneClean.endsWith(inputClean) || inputClean.endsWith(userPhoneClean)) {
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

    // Vérifie si l'email est déjà pris (privilégiés + users)
    const isPrivileged = PRIVILEGED_ACCOUNTS.some((a) => a.email === normalized);
    if (isPrivileged) {
      return { success: false, error: 'Cet email est déjà utilisé.' };
    }

    const users = getRegisteredUsers();
    const exists = users.some((u) => u.email === normalized);
    if (exists) {
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }

    // Vérifie si le numéro de téléphone est déjà pris
    if (phone.trim()) {
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
      id: `user-${Date.now()}`,
      email: normalized,
      password,
      name: name.trim(),
      phone: phone.trim(),
      country: country.trim() || 'Gabon',
      province: province.trim(),
      city: city.trim(),
      district: district.trim(),
      photo: photo || '',
      avatar: photo || '👤',
      idNumber: idNumber.trim(),
      idCardRecto: idCardRecto || '',
      idCardVerso: idCardVerso || '',
      role: 'user',
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
  const isSuperAdmin = () => currentUser?.role === 'superadmin';
  const isAdmin = () => currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
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
