import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserProfile } from '../types';
import { 
  getAuthSession, saveAuthSession, clearAuthSession, 
  authenticateUser, registerUser, resetUserPassword, 
  ensureDemoAccount, markUserOnboarded 
} from '../utils/cryptoAuth';
import { getProfile, saveProfile, calculateBMR, calculateTDEE, calculateTargets } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (profileUpdates?: Partial<UserProfile>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await ensureDemoAccount();
        const active = getAuthSession();
        if (active) {
          setUser(active);
        }
      } catch (err) {
        console.error('Failed to restore auth session', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string, 
    password: string, 
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authenticateUser(email, password);
      if (res.success && res.user) {
        saveAuthSession(res.user, rememberMe);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Authentication failed' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed unexpectedly';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await registerUser(name, email, password);
      if (res.success && res.user) {
        saveAuthSession(res.user, true);
        setUser(res.user);

        // Initialize personal profile with the user's name
        const profile = getProfile();
        saveProfile({
          ...profile,
          name: res.user.name
        });

        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed unexpectedly';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const resetPassword = async (
    email: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    return await resetUserPassword(email, newPassword);
  };

  const completeOnboarding = (profileUpdates?: Partial<UserProfile>) => {
    if (!user) return;

    // Apply onboarding updates to the user's isolated profile
    const existingProfile = getProfile();
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profileUpdates
    };

    // Recalculate targets based on newly provided onboarding metrics
    const bmr = calculateBMR(
      updatedProfile.weightKg, 
      updatedProfile.heightCm, 
      updatedProfile.age, 
      updatedProfile.gender
    );
    const tdee = calculateTDEE(bmr, updatedProfile.activityLevel);
    const targets = calculateTargets(tdee, updatedProfile.weightKg, updatedProfile.goal);

    updatedProfile.tdee = tdee;
    updatedProfile.calorieTarget = targets.calories;
    updatedProfile.proteinTargetGrams = targets.protein;
    updatedProfile.carbsTargetGrams = targets.carbs;
    updatedProfile.fatTargetGrams = targets.fat;
    updatedProfile.fiberTargetGrams = targets.fiber;

    saveProfile(updatedProfile);

    // Mark as onboarded
    const updatedUser = markUserOnboarded(user.id);
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setUser({ ...user, onboarded: true });
    }
  };

  const refreshUser = () => {
    const session = getAuthSession();
    setUser(session);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        completeOnboarding,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
