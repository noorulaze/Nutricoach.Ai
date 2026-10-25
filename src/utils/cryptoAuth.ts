import { AuthUser, StoredUserAccount } from '../types';

const STORAGE_ACCOUNTS_KEY = 'nutricoach_accounts_v1';
const STORAGE_SESSION_KEY = 'nutricoach_auth_session_v1';
const STORAGE_CURRENT_USER_ID_KEY = 'nutricoach_current_user_id';

/**
 * Generate a cryptographically secure random salt hex string
 */
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Securely hash password with a cryptographic salt using Web Crypto SHA-256.
 * Passwords are NEVER stored or transmitted in plaintext.
 */
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '::nutricoach_salt::' + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Retrieve all registered accounts from local secure storage
 */
export const getStoredAccounts = (): StoredUserAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading stored accounts', err);
  }
  return [];
};

/**
 * Persist accounts list
 */
const saveAccounts = (accounts: StoredUserAccount[]): void => {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Error saving accounts', err);
  }
};

/**
 * Initialize default demo user if not already registered
 */
export const ensureDemoAccount = async (): Promise<StoredUserAccount> => {
  const accounts = getStoredAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === 'demo@nutricoach.ai');
  if (existing) {
    return existing;
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword('Password123!', salt);
  const demoUser: StoredUserAccount = {
    id: 'usr_demo_alex',
    name: 'Alex Vance',
    email: 'demo@nutricoach.ai',
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    onboarded: true
  };

  accounts.push(demoUser);
  saveAccounts(accounts);
  return demoUser;
};

/**
 * Register a new user with input validation and salted password hashing
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  // Input validation
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Please enter your full name (at least 2 characters).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Ensure accounts loaded
  await ensureDemoAccount();
  const accounts = getStoredAccounts();

  // Check duplicate
  if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please log in.' };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const newId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const newAccount: StoredUserAccount = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    onboarded: false // New users go to onboarding first
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  const authUser: AuthUser = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    createdAt: newAccount.createdAt,
    onboarded: newAccount.onboarded
  };

  return { success: true, user: authUser };
};

/**
 * Authenticate existing user by checking salted hash
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, error: 'Please enter both your email and password.' };
  }

  // Ensure demo account exists
  await ensureDemoAccount();
  const accounts = getStoredAccounts();

  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (!account) {
    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  }

  const computedHash = await hashPassword(password, account.salt);
  if (computedHash !== account.passwordHash) {
    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  }

  const authUser: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
    onboarded: account.onboarded
  };

  return { success: true, user: authUser };
};

/**
 * Reset password for an account (Password Recovery Flow)
 */
export const resetUserPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Please enter your registered email address.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
  if (index === -1) {
    return { success: false, error: 'No account found with this email address.' };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  accounts[index].salt = salt;
  accounts[index].passwordHash = passwordHash;
  saveAccounts(accounts);

  return { success: true };
};

/**
 * Session persistence in browser
 */
export const saveAuthSession = (user: AuthUser, rememberMe = true): void => {
  try {
    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, serialized);
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, serialized);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
    // Set active user ID for storage isolation
    localStorage.setItem(STORAGE_CURRENT_USER_ID_KEY, user.id);
  } catch (err) {
    console.error('Error saving auth session', err);
  }
};

export const getAuthSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY) || sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.id) {
        localStorage.setItem(STORAGE_CURRENT_USER_ID_KEY, user.id);
        return user;
      }
    }
  } catch (err) {
    console.error('Error reading auth session', err);
  }
  return null;
};

export const clearAuthSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_CURRENT_USER_ID_KEY);
  } catch (err) {
    console.error('Error clearing auth session', err);
  }
};

/**
 * Mark a user as onboarded in both the stored accounts and active session
 */
export const markUserOnboarded = (userId: string): AuthUser | null => {
  try {
    const accounts = getStoredAccounts();
    const index = accounts.findIndex((a) => a.id === userId);
    if (index !== -1) {
      accounts[index].onboarded = true;
      saveAccounts(accounts);
    }

    const session = getAuthSession();
    if (session && session.id === userId) {
      session.onboarded = true;
      saveAuthSession(session, true);
      return session;
    }
  } catch (err) {
    console.error('Error marking user onboarded', err);
  }
  return null;
};

export const getActiveUserId = (): string => {
  const current = localStorage.getItem(STORAGE_CURRENT_USER_ID_KEY);
  if (current) return current;
  const session = getAuthSession();
  if (session?.id) {
    localStorage.setItem(STORAGE_CURRENT_USER_ID_KEY, session.id);
    return session.id;
  }
  return '';
};
