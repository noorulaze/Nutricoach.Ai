import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Bot, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthWellnessBanner from '../components/AuthWellnessBanner';
import ThemeToggle from '../components/ThemeToggle';
import NutriCoachLogo from '../components/NutriCoachLogo';
import AccountLinkingModal from '../components/AccountLinkingModal';
import OAuthSetupModal from '../components/OAuthSetupModal';
import { AccountLinkingContext, SocialProvider } from '../utils/socialAuth';

export default function SignupPage() {
  const { 
    signup, 
    isAuthenticated, 
    login,
    loginWithGoogle,
    loginWithApple,
    loginWithSocialSandbox,
    linkSocialAccount,
    isSocialConfigured,
    oauthConfig,
    updateOAuthConfig
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Social OAuth & Account Linking Modals
  const [linkingModalOpen, setLinkingModalOpen] = useState(false);
  const [linkingContext, setLinkingContext] = useState<AccountLinkingContext | null>(null);
  const [oauthSetupModalOpen, setOauthSetupModalOpen] = useState(false);
  const [activeOauthProvider, setActiveOauthProvider] = useState<SocialProvider | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/onboarding', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Password strength helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-400' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-[#5ba83c]' };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please acknowledge the terms of use and privacy notice to continue.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(name.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Account registered successfully! Welcome to NutriCoach AI.', 'success', 'Account Created');
      // Guide newly registered user directly to the personalized onboarding setup
      navigate('/onboarding', { replace: true });
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
      showToast(res.error || 'Registration failed', 'error');
    }
  };

  const handleGoogleClick = async () => {
    setErrorMessage('');
    if (!isSocialConfigured('google')) {
      setActiveOauthProvider('google');
      setOauthSetupModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        showToast(`Welcome to NutriCoach AI, ${res.user.name}!`, 'success', 'Google Sign-Up');
        const target = res.user.onboarded ? '/' : '/onboarding';
        navigate(target, { replace: true });
      } else if (res.requiresLinking && res.linkingContext) {
        setLinkingContext(res.linkingContext);
        setLinkingModalOpen(true);
      } else if (res.error) {
        setErrorMessage(res.error);
        showToast(res.error, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleClick = async () => {
    setErrorMessage('');
    if (!isSocialConfigured('apple')) {
      setActiveOauthProvider('apple');
      setOauthSetupModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithApple();
      if (res.success && res.user) {
        showToast(`Welcome to NutriCoach AI, ${res.user.name}!`, 'success', 'Apple Sign-Up');
        const target = res.user.onboarded ? '/' : '/onboarding';
        navigate(target, { replace: true });
      } else if (res.requiresLinking && res.linkingContext) {
        setLinkingContext(res.linkingContext);
        setLinkingModalOpen(true);
      } else if (res.error) {
        setErrorMessage(res.error);
        showToast(res.error, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSandbox = async (provider: SocialProvider, mockProfile?: { email: string; name: string }) => {
    setIsSubmitting(true);
    try {
      const res = await loginWithSocialSandbox(provider, mockProfile);
      if (res.success && res.user) {
        showToast(`Welcome ${res.user.name}! Signed up via ${provider === 'google' ? 'Google' : 'Apple'} Sandbox.`, 'success', 'Social Sign-Up');
        const target = res.user.onboarded ? '/' : '/onboarding';
        navigate(target, { replace: true });
      } else if (res.requiresLinking && res.linkingContext) {
        setLinkingContext(res.linkingContext);
        setLinkingModalOpen(true);
      } else if (res.error) {
        setErrorMessage(res.error);
        showToast(res.error, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmLink = async (passwordAttempt: string) => {
    if (!linkingContext) return { success: false, error: 'Linking context missing' };
    const res = await linkSocialAccount(linkingContext, passwordAttempt);
    if (res.success && res.user) {
      showToast(`Account linked successfully! Welcome back, ${res.user.name}.`, 'success', 'Account Linked');
      setLinkingModalOpen(false);
      setLinkingContext(null);
      const target = res.user.onboarded ? '/' : '/onboarding';
      navigate(target, { replace: true });
      return { success: true };
    }
    return { success: false, error: res.error || 'Password verification failed.' };
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f5] dark:bg-[#1C211D] text-[#192418] dark:text-[#E8EDE7] flex flex-col lg:flex-row relative selection:bg-[#8BAF78]/25 font-sans transition-colors duration-200">
      
      {/* Theme Toggle Button top right */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle variant="icon" />
      </div>

      {/* ========================================================================= */}
      {/* LEFT SECTION: Branded Wellness Presentation (matches reference image)     */}
      {/* ========================================================================= */}
      <AuthWellnessBanner />

      {/* ========================================================================= */}
      {/* RIGHT SECTION: The Elevated Clean White Registration Card                 */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[46%] xl:w-[44%] flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-14 bg-[#f6f8f5] dark:bg-[#1C211D]">
        <div className="w-full max-w-[460px] bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-6 sm:p-9 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] animate-fade-in space-y-5">
          
          {/* Top Card Branding */}
          <div className="flex flex-col items-center text-center">
            <NutriCoachLogo size="md" className="mb-2" />

            <h2 className="text-2xl sm:text-[26px] font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
              Create your account
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5e6f5e] font-medium mt-0.5">
              Start your personalized health and fitness journey.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f9fbf8] border border-[#e2e8df] hover:border-[#cbd7c8] text-xs font-bold text-[#192418] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleAppleClick}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f9fbf8] border border-[#e2e8df] hover:border-[#cbd7c8] text-xs font-bold text-[#192418] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.77 1.04-1.84.93-2.92-.93.04-2.07.62-2.73 1.39-.58.67-1.09 1.76-.96 2.81 1.04.08 2.14-.51 2.76-1.28z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#e8ede6] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#8e9f8e] uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
              </div>
            </div>

            {/* Password Field with Strength Indicator */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-[#8e9f8e] hover:text-[#192418] absolute right-3 top-1/2 -translate-y-1/2 rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#f0f4ee] rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[#7a8c79]">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
                {passwordsMatch && (
                  <Check className="w-4 h-4 text-[#5ba83c] absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Terms of Service & Privacy agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#5e6f5e] leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5ba83c] border-[#cbd7c8] focus:ring-[#5ba83c] accent-[#5ba83c] cursor-pointer mt-0.5"
                />
                <span>
                  I agree to the <span className="font-bold text-[#192418]">Terms of Service</span> and acknowledge the <span className="font-bold text-[#192418]">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-[#7cb342] hover:bg-[#6ea935] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="text-center text-xs text-[#5e6f5e] font-medium pt-1">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-[#5ba83c] hover:text-[#46822c] hover:underline"
            >
              Log in
            </Link>
          </div>

          {/* Bottom Card */}
          <div className="bg-[#f2f7ef] border border-[#d8e8d5] rounded-2xl p-4 flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white border border-[#d8e8d5] flex items-center justify-center text-[#5ba83c] shrink-0 shadow-xs">
                <Bot className="w-5 h-5 text-[#5ba83c]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#192418] block leading-tight">
                  Returning to NutriCoach?
                </span>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-0.5 leading-snug">
                  Log in to resume your active diet logs & workouts.
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-8 h-8 rounded-full bg-white hover:bg-[#eaf4e6] border border-[#d8e8d5] text-[#192418] flex items-center justify-center shrink-0 shadow-xs transition-colors"
              title="Go to Login"
            >
              <ArrowRight className="w-4 h-4 text-[#192418]" />
            </Link>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACCOUNT LINKING VERIFICATION MODAL                                        */}
      {/* ========================================================================= */}
      <AccountLinkingModal
        isOpen={linkingModalOpen}
        context={linkingContext}
        onClose={() => {
          setLinkingModalOpen(false);
          setLinkingContext(null);
        }}
        onConfirmLink={handleConfirmLink}
      />

      {/* ========================================================================= */}
      {/* OAUTH CREDENTIALS SETUP & VERIFICATION MODAL                              */}
      {/* ========================================================================= */}
      <OAuthSetupModal
        isOpen={oauthSetupModalOpen}
        provider={activeOauthProvider}
        config={oauthConfig}
        onClose={() => {
          setOauthSetupModalOpen(false);
          setActiveOauthProvider(null);
        }}
        onSaveConfig={(cfg) => {
          updateOAuthConfig(cfg);
          showToast('OAuth configuration updated successfully.', 'success', 'Saved');
        }}
        onTestSandbox={handleTestSandbox}
      />

    </div>
  );
}
