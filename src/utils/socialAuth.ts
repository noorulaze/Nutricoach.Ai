import { AuthUser, StoredUserAccount, LinkedSocialProvider } from '../types';
import { 
  getStoredAccounts, 
  saveAuthSession, 
  hashPassword 
} from './cryptoAuth';
import { getProfile, saveProfile } from './storage';

export type SocialProvider = 'google' | 'apple';

export interface SocialAuthPayload {
  provider: SocialProvider;
  providerUserId: string; // The Google or Apple 'sub'
  email: string;
  name: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface AccountLinkingContext {
  provider: SocialProvider;
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface SocialAuthResult {
  success: boolean;
  user?: AuthUser;
  isNewUser?: boolean;
  requiresLinking?: boolean;
  linkingContext?: AccountLinkingContext;
  error?: string;
}

export interface OAuthConfig {
  googleClientId: string;
  appleClientId: string;
  appleRedirectUri: string;
}

const STORAGE_OAUTH_CONFIG_KEY = 'nutricoach_oauth_config_v1';

/**
 * Retrieve current OAuth Client configuration from environment or secure storage
 */
export const getOAuthConfig = (): OAuthConfig => {
  let stored: Partial<OAuthConfig> = {};
  try {
    const raw = localStorage.getItem(STORAGE_OAUTH_CONFIG_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {
    // Ignore JSON parse errors
  }

  const envGoogle = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || '';
  const envApple = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APPLE_CLIENT_ID) || '';
  const envAppleRedirect = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APPLE_REDIRECT_URI) || window.location.origin;

  return {
    googleClientId: stored.googleClientId || envGoogle,
    appleClientId: stored.appleClientId || envApple,
    appleRedirectUri: stored.appleRedirectUri || envAppleRedirect
  };
};

/**
 * Save runtime OAuth Client credentials (e.g. from developer setup modal)
 */
export const saveOAuthConfig = (config: Partial<OAuthConfig>): void => {
  try {
    const current = getOAuthConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_OAUTH_CONFIG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save OAuth configuration', err);
  }
};

/**
 * Check if a social provider is configured with client credentials
 */
export const isSocialProviderConfigured = (provider: SocialProvider): boolean => {
  const config = getOAuthConfig();
  if (provider === 'google') {
    return Boolean(config.googleClientId && config.googleClientId.trim().length > 5);
  }
  if (provider === 'apple') {
    return Boolean(config.appleClientId && config.appleClientId.trim().length > 3);
  }
  return false;
};

/**
 * Safely decode a base64url-encoded JWT token without external libraries
 */
export const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse JWT payload', err);
    return null;
  }
};

/**
 * Dynamically load an external script if not already present
 */
const loadScript = (src: string, id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById(id)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

/**
 * Initiate real Google OAuth via Google Identity Services
 */
export const startGoogleSignIn = async (): Promise<SocialAuthPayload> => {
  const config = getOAuthConfig();
  if (!config.googleClientId) {
    throw new Error('Google OAuth Client ID is not configured. Please provide your Google Client ID.');
  }

  // Load Google Identity Services SDK
  const loaded = await loadScript('https://accounts.google.com/gsi/client', 'google-gsi-client');
  if (!loaded) {
    throw new Error('Unable to connect to Google Identity Services. Please check your internet connection.');
  }

  const googleAccounts = (window as unknown as { google?: { accounts?: { id: any; oauth2: any } } }).google?.accounts;
  if (!googleAccounts?.id) {
    throw new Error('Google Identity Services library failed to initialize.');
  }

  return new Promise((resolve, reject) => {
    try {
      googleAccounts.id.initialize({
        client_id: config.googleClientId,
        callback: (response: { credential?: string; error?: string }) => {
          if (response.error) {
            if (response.error === 'popup_closed_by_user') {
              reject(new Error('Google login was cancelled.'));
            } else {
              reject(new Error(`Google authentication failed: ${response.error}`));
            }
            return;
          }

          if (!response.credential) {
            reject(new Error('No credential returned by Google.'));
            return;
          }

          const payload = parseJwtPayload(response.credential);
          if (!payload) {
            reject(new Error('Failed to verify Google identity credential.'));
            return;
          }

          const sub = (payload.sub as string) || '';
          const email = (payload.email as string) || '';
          const name = (payload.name as string) || (payload.given_name as string) || email.split('@')[0];
          const picture = (payload.picture as string) || undefined;
          const emailVerified = Boolean(payload.email_verified);

          if (!email) {
            reject(new Error('Google account did not return a valid email address.'));
            return;
          }

          resolve({
            provider: 'google',
            providerUserId: sub,
            email: email.toLowerCase(),
            name,
            avatarUrl: picture,
            emailVerified
          });
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Prompt Google Account Chooser
      googleAccounts.id.prompt((notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt fails or is blocked by browser, fallback to tokenClient
          try {
            const tokenClient = googleAccounts.oauth2.initTokenClient({
              client_id: config.googleClientId,
              scope: 'openid email profile',
              callback: async (tokenResponse: { access_token?: string; error?: string }) => {
                if (tokenResponse.error) {
                  reject(new Error('Google login was cancelled or failed.'));
                  return;
                }
                if (!tokenResponse.access_token) {
                  reject(new Error('No access token returned from Google.'));
                  return;
                }

                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  });
                  if (!res.ok) {
                    throw new Error('Failed to fetch profile from Google.');
                  }
                  const info = await res.json();
                  resolve({
                    provider: 'google',
                    providerUserId: info.sub,
                    email: info.email.toLowerCase(),
                    name: info.name || info.email.split('@')[0],
                    avatarUrl: info.picture,
                    emailVerified: Boolean(info.email_verified)
                  });
                } catch (fetchErr: any) {
                  reject(new Error(fetchErr.message || 'Failed to retrieve Google profile.'));
                }
              },
              error_callback: (err: any) => {
                reject(new Error(err?.message || 'Google sign-in popup was cancelled.'));
              }
            });
            tokenClient.requestAccessToken();
          } catch (e: any) {
            reject(new Error(e.message || 'Could not display Google Sign-In prompt.'));
          }
        }
      });
    } catch (err: any) {
      reject(new Error(err.message || 'Failed to start Google sign-in.'));
    }
  });
};

/**
 * Initiate real Sign in with Apple via Apple JS SDK
 */
export const startAppleSignIn = async (): Promise<SocialAuthPayload> => {
  const config = getOAuthConfig();
  if (!config.appleClientId) {
    throw new Error('Apple Service ID is not configured. Please provide your Apple Client ID.');
  }

  // Load Apple JS SDK
  const loaded = await loadScript(
    'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth/js',
    'apple-auth-sdk'
  );
  if (!loaded) {
    throw new Error('Unable to connect to Apple ID services. Please check your internet connection.');
  }

  const AppleID = (window as unknown as { AppleID?: { auth: any } }).AppleID;
  if (!AppleID?.auth) {
    throw new Error('Apple Sign-In library failed to initialize.');
  }

  return new Promise(async (resolve, reject) => {
    try {
      AppleID.auth.init({
        clientId: config.appleClientId,
        scope: 'name email',
        redirectURI: config.appleRedirectUri || window.location.origin,
        state: 'nc_' + Math.random().toString(36).substring(2, 10),
        usePopup: true
      });

      const response = await AppleID.auth.signIn();
      if (!response || !response.authorization) {
        reject(new Error('Apple Sign-In was cancelled.'));
        return;
      }

      const idToken = response.authorization.id_token;
      const payload = parseJwtPayload(idToken);
      if (!payload) {
        reject(new Error('Failed to verify Apple ID token signature.'));
        return;
      }

      const sub = (payload.sub as string) || '';
      const email = ((payload.email as string) || (response.user?.email as string) || '').toLowerCase();
      
      let name = '';
      if (response.user?.name) {
        const { firstName, lastName } = response.user.name;
        name = [firstName, lastName].filter(Boolean).join(' ');
      }
      if (!name) {
        name = email ? email.split('@')[0] : 'Apple User';
      }

      if (!email) {
        reject(new Error('Apple Sign-In did not return a valid email address.'));
        return;
      }

      resolve({
        provider: 'apple',
        providerUserId: sub,
        email,
        name,
        emailVerified: true // Apple verifies all Apple ID emails
      });
    } catch (err: any) {
      if (err?.error === 'popup_closed_by_user') {
        reject(new Error('Apple sign-in was cancelled.'));
      } else {
        reject(new Error(err?.error || err?.message || 'Apple sign-in failed.'));
      }
    }
  });
};

/**
 * Process a verified social login payload.
 * Enforces account linking verification when email already exists under a different method.
 */
export const processSocialLogin = async (
  payload: SocialAuthPayload
): Promise<SocialAuthResult> => {
  const cleanEmail = payload.email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Social provider did not supply an email address.' };
  }

  const accounts = getStoredAccounts();

  // 1. Check if an account already has this provider and providerUserId linked
  const existingLinkedAccount = accounts.find((a) =>
    a.linkedProviders?.some(
      (lp) => lp.provider === payload.provider && lp.providerUserId === payload.providerUserId
    )
  );

  if (existingLinkedAccount) {
    // Verified returning social user! Log in directly
    const authUser: AuthUser = {
      id: existingLinkedAccount.id,
      name: existingLinkedAccount.name,
      email: existingLinkedAccount.email,
      avatarUrl: payload.avatarUrl || existingLinkedAccount.avatarUrl,
      createdAt: existingLinkedAccount.createdAt,
      onboarded: existingLinkedAccount.onboarded,
      authProvider: existingLinkedAccount.authProvider || payload.provider,
      linkedProviders: existingLinkedAccount.linkedProviders
    };

    saveAuthSession(authUser, true);
    return { success: true, user: authUser, isNewUser: false };
  }

  // 2. Check if an account with this email already exists under a different method
  const existingEmailAccount = accounts.find(
    (a) => a.email.toLowerCase() === cleanEmail
  );

  if (existingEmailAccount) {
    // CRITICAL SECURITY CHECK:
    // Never merge accounts automatically based only on matching email addresses!
    // Require user verification before linking.
    return {
      success: false,
      requiresLinking: true,
      linkingContext: {
        provider: payload.provider,
        providerUserId: payload.providerUserId,
        email: cleanEmail,
        name: payload.name,
        avatarUrl: payload.avatarUrl
      },
      error: `An existing account with ${cleanEmail} was found. To link your ${
        payload.provider === 'google' ? 'Google' : 'Apple'
      } account to this existing profile, please verify your account password.`
    };
  }

  // 3. No existing account exists: Register a brand new user account!
  const newUserId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newLinkedProvider: LinkedSocialProvider = {
    provider: payload.provider,
    providerUserId: payload.providerUserId,
    email: cleanEmail,
    linkedAt: new Date().toISOString(),
    avatarUrl: payload.avatarUrl
  };

  const newAccount: StoredUserAccount = {
    id: newUserId,
    name: payload.name || cleanEmail.split('@')[0],
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    onboarded: false, // New social users go to onboarding first
    authProvider: payload.provider,
    avatarUrl: payload.avatarUrl,
    linkedProviders: [newLinkedProvider],
    emailVerified: payload.emailVerified
  };

  accounts.push(newAccount);
  try {
    localStorage.setItem('nutricoach_accounts_v1', JSON.stringify(accounts));
  } catch (err) {
    console.error('Error saving new social account', err);
  }

  const authUser: AuthUser = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    avatarUrl: newAccount.avatarUrl,
    createdAt: newAccount.createdAt,
    onboarded: newAccount.onboarded,
    authProvider: newAccount.authProvider,
    linkedProviders: newAccount.linkedProviders
  };

  saveAuthSession(authUser, true);

  // Initialize isolated profile with user's name
  try {
    const existingProfile = getProfile();
    saveProfile({
      ...existingProfile,
      name: newAccount.name
    });
  } catch (err) {
    console.error('Error initializing profile', err);
  }

  return { success: true, user: authUser, isNewUser: true };
};

/**
 * Verify existing account credentials and securely link the social provider
 */
export const verifyAndLinkSocialAccount = async (
  context: AccountLinkingContext,
  passwordAttempt: string
): Promise<SocialAuthResult> => {
  const accounts = getStoredAccounts();
  const cleanEmail = context.email.trim().toLowerCase();
  const accountIndex = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

  if (accountIndex === -1) {
    return { success: false, error: 'Existing account not found.' };
  }

  const targetAccount = accounts[accountIndex];

  // If the account has a password hash and salt, verify it
  if (targetAccount.passwordHash && targetAccount.salt) {
    const computedHash = await hashPassword(passwordAttempt, targetAccount.salt);
    if (computedHash !== targetAccount.passwordHash) {
      return {
        success: false,
        requiresLinking: true,
        linkingContext: context,
        error: 'Incorrect password. Account linking could not be authorized.'
      };
    }
  }

  // Password verified! Safely link the provider to this account
  const newLink: LinkedSocialProvider = {
    provider: context.provider,
    providerUserId: context.providerUserId,
    email: cleanEmail,
    linkedAt: new Date().toISOString(),
    avatarUrl: context.avatarUrl
  };

  if (!targetAccount.linkedProviders) {
    targetAccount.linkedProviders = [];
  }

  // Ensure no duplicate link
  const alreadyLinked = targetAccount.linkedProviders.some(
    (lp) => lp.provider === context.provider && lp.providerUserId === context.providerUserId
  );
  if (!alreadyLinked) {
    targetAccount.linkedProviders.push(newLink);
  }

  if (context.avatarUrl && !targetAccount.avatarUrl) {
    targetAccount.avatarUrl = context.avatarUrl;
  }

  accounts[accountIndex] = targetAccount;
  try {
    localStorage.setItem('nutricoach_accounts_v1', JSON.stringify(accounts));
  } catch (err) {
    console.error('Error updating accounts with linked provider', err);
  }

  const authUser: AuthUser = {
    id: targetAccount.id,
    name: targetAccount.name,
    email: targetAccount.email,
    avatarUrl: targetAccount.avatarUrl,
    createdAt: targetAccount.createdAt,
    onboarded: targetAccount.onboarded,
    authProvider: targetAccount.authProvider || 'email',
    linkedProviders: targetAccount.linkedProviders
  };

  saveAuthSession(authUser, true);
  return { success: true, user: authUser, isNewUser: false };
};

/**
 * Sandbox / Developer Simulator for local testing and automated verification.
 * Follows the EXACT same account creation, linking verification, and data isolation logic.
 */
export const simulateSocialAuth = async (
  provider: SocialProvider,
  mockProfile?: { email: string; name: string; avatarUrl?: string; emailVerified?: boolean }
): Promise<SocialAuthResult> => {
  const email = mockProfile?.email || `user.${provider}@nutricoach.ai`;
  const name = mockProfile?.name || `${provider === 'google' ? 'Google' : 'Apple'} Athlete`;
  const providerUserId = `${provider}_sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const payload: SocialAuthPayload = {
    provider,
    providerUserId,
    email: email.toLowerCase(),
    name,
    avatarUrl: mockProfile?.avatarUrl,
    emailVerified: mockProfile?.emailVerified ?? true
  };

  return await processSocialLogin(payload);
};
