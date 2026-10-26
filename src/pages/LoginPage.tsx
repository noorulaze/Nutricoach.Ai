import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  Bot, 
  Check, 
  AlertCircle, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthWellnessBanner from '../components/AuthWellnessBanner';
import ThemeToggle from '../components/ThemeToggle';
import NutriCoachLogo, { NutriCoachSymbol } from '../components/NutriCoachLogo';
import AccountLinkingModal from '../components/AccountLinkingModal';
import OAuthSetupModal from '../components/OAuthSetupModal';
import { AccountLinkingContext, SocialProvider } from '../utils/socialAuth';
import grainBowlImg from '../assets/food/grain-bowl.jpg';

export default function LoginPage() {
  const { 
    login, 
    resetPassword, 
    isAuthenticated,
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
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Social OAuth & Account Linking Modals
  const [linkingModalOpen, setLinkingModalOpen] = useState(false);
  const [linkingContext, setLinkingContext] = useState<AccountLinkingContext | null>(null);
  const [oauthSetupModalOpen, setOauthSetupModalOpen] = useState(false);
  const [activeOauthProvider, setActiveOauthProvider] = useState<SocialProvider | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email.trim(), password, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Welcome back to NutriCoach AI!', 'success', 'Authenticated');
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid email or password. Please verify your credentials.');
      showToast(res.error || 'Authentication failed', 'error');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('demo@nutricoach.ai');
    setPassword('Password123!');
    setIsSubmitting(true);
    setErrorMessage('');

    const res = await login('demo@nutricoach.ai', 'Password123!', true);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Welcome, Alex! Logged into your NutriCoach dashboard.', 'success', 'Demo Session');
      navigate('/', { replace: true });
    } else {
      setErrorMessage(res.error || 'Failed to initialize demo session');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !newPassword) {
      showToast('Please enter both email and new password', 'error');
      return;
    }

    setForgotSubmitting(true);
    const res = await resetPassword(forgotEmail.trim(), newPassword);
    setForgotSubmitting(false);

    if (res.success) {
      setForgotSuccess(true);
      showToast('Password updated successfully! You can now log in.', 'success', 'Password Reset');
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSuccess(false);
        setEmail(forgotEmail.trim());
        setPassword(newPassword);
      }, 1500);
    } else {
      showToast(res.error || 'Could not reset password', 'error');
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
        showToast(`Welcome, ${res.user.name}! Signed in with Google.`, 'success', 'Google Sign-In');
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
        showToast(`Welcome, ${res.user.name}! Signed in with Apple.`, 'success', 'Apple Sign-In');
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
        showToast(`Signed in as ${res.user.name} (${provider === 'google' ? 'Google' : 'Apple'})`, 'success', 'Social Login');
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
    <div className="min-h-screen w-full bg-[#f6f8f5] dark:bg-[#1C211D] text-[#192418] dark:text-[#E8EDE7] flex flex-col lg:flex-row relative selection:bg-[#8BAF78]/25 font-sans transition-colors duration-200 overflow-x-hidden">
      
      {/* Theme Toggle Button top right */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle variant="icon" />
      </div>

      {/* Top Left Leaf Decoration matching mobile mockup */}
      <div className="lg:hidden absolute -top-4 -left-4 w-28 h-28 opacity-45 dark:opacity-30 pointer-events-none select-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#5ba83c] dark:fill-[#8BAF78]">
          <path d="M0,0 C30,12 60,35 70,60 C50,65 30,55 15,40 C5,25 0,10 0,0 Z" opacity="0.8" />
          <path d="M0,20 C20,25 45,45 50,70 C35,72 20,62 10,50 C2,38 0,28 0,20 Z" opacity="0.5" />
          <path d="M20,0 C40,15 65,30 85,35 C75,50 55,52 40,40 C28,30 22,15 20,0 Z" opacity="0.6" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LEFT SECTION: Branded Wellness Presentation (Desktop only)                */}
      {/* ========================================================================= */}
      <AuthWellnessBanner />

      {/* ========================================================================= */}
      {/* RIGHT SECTION: The Elevated Clean Login Card (Responsive & Mobile-First)   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col items-center justify-center p-3 sm:p-8 lg:p-12 xl:p-14 bg-[#f6f8f5] dark:bg-[#1C211D] relative z-20">
        <div className="w-full max-w-[440px] bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-8 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] animate-fade-in space-y-5">
          
          {/* Top Card Branding matching mobile mockup */}
          <div className="flex flex-col items-center text-center pt-1">
            <NutriCoachLogo size="md" showTagline className="mb-3" />

            <h2 className="text-2xl sm:text-[28px] font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight flex items-center gap-1.5">
              <span>Welcome Back</span>
              <span className="text-2xl select-none" role="img" aria-label="waving hand">👋</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium mt-1">
              Sign in to continue your health journey
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or User ID Field */}
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8e9f8e] dark:text-[#7A8279] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Email or User ID"
                  autoComplete="username"
                  className="w-full bg-[#fcfdfc] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] dark:placeholder-[#7A8279] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] dark:focus:border-[#8BAF78] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8e9f8e] dark:text-[#7A8279] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full bg-[#fcfdfc] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] dark:placeholder-[#7A8279] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] dark:focus:border-[#8BAF78] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-[#8e9f8e] dark:text-[#7A8279] hover:text-[#192418] dark:hover:text-[#E8EDE7] absolute right-3 top-1/2 -translate-y-1/2 rounded-lg transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5ba83c] dark:text-[#8BAF78] border-[#cbd7c8] dark:border-[#394139] focus:ring-[#5ba83c] accent-[#5ba83c] dark:accent-[#8BAF78] cursor-pointer"
                />
                <span className="font-semibold text-[#5e6f5e] dark:text-[#A2AAA1]">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotModalOpen(true);
                }}
                className="text-xs font-bold text-[#3b7e23] dark:text-[#8BAF78] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button: "Sign In ->" */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-[#325b24] hover:bg-[#284a1d] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] dark:text-[#161D15] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Divider: "or continue with" */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#e8ede6] dark:border-[#394139] w-full" />
            <span className="bg-white dark:bg-[#272E29] px-3 text-[11px] font-semibold text-[#8e9f8e] dark:text-[#7A8279] lowercase tracking-wide absolute">
              or continue with
            </span>
          </div>

          {/* Social OAuth Buttons side-by-side matching mockup */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting}
              title="Continue with Google"
              aria-label="Continue with Google"
              className="py-2.5 px-3 rounded-2xl bg-white dark:bg-[#1C211D] hover:bg-[#f9fbf8] dark:hover:bg-[#222823] border border-[#e2e8df] dark:border-[#394139] text-[11px] sm:text-xs font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
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
              <span className="truncate">Google</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={handleAppleClick}
              disabled={isSubmitting}
              title="Continue with Apple"
              aria-label="Continue with Apple"
              className="py-2.5 px-3 rounded-2xl bg-white dark:bg-[#1C211D] hover:bg-[#f9fbf8] dark:hover:bg-[#222823] border border-[#e2e8df] dark:border-[#394139] text-[11px] sm:text-xs font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.77 1.04-1.84.93-2.92-.93.04-2.07.62-2.73 1.39-.58.67-1.09 1.76-.96 2.81 1.04.08 2.14-.51 2.76-1.28z" />
              </svg>
              <span className="truncate">Apple</span>
            </button>
          </div>

          {/* Registration Link */}
          <div className="text-center text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium pt-1">
            <span>Don't have an account? </span>
            <Link
              to="/signup"
              className="font-bold text-[#3b7e23] dark:text-[#8BAF78] hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#edf2ea] dark:hover:bg-[#222823] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              <span>1-Click Demo Login (Alex Vance)</span>
            </button>
          </div>

          {/* Mobile Bottom Wellness Art matching media_1792991978545.jpg */}
          <div className="lg:hidden w-full relative pt-4 pb-1 flex flex-col items-center">
            {/* Curved wave background glow */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#e8f2e4]/70 via-[#f2f7ef]/40 to-transparent dark:from-[#212822]/90 dark:via-[#1F2520]/40 rounded-b-[32px] pointer-events-none" />
            
            {/* Art Composition: Bowl, Shaker, Dumbbell with sprigs */}
            <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-4 my-2">
              {/* Salad Bowl with egg & avocado */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#5ba83c]/20 dark:bg-[#8BAF78]/20 blur-sm scale-105" />
                <img
                  src={grainBowlImg}
                  alt="Nutritious grain bowl with greens, avocado, and protein"
                  className="w-full h-full object-cover rounded-full border-2 border-white dark:border-[#272E29] shadow-md"
                />
              </div>

              {/* Green Shaker Bottle with "N" folded leaf monogram */}
              <div className="relative flex flex-col items-center shrink-0">
                <div className="w-11 h-22 sm:w-12 sm:h-24 bg-[#4a773d] dark:bg-[#56834b] rounded-t-2xl rounded-b-xl shadow-md border border-[#375a2d] dark:border-[#426738] flex flex-col items-center justify-between p-1 relative overflow-hidden">
                  {/* Shaker Cap */}
                  <div className="w-7 h-2.5 bg-[#253e1f] rounded-t-sm -mt-0.5" />
                  {/* N Monogram */}
                  <div className="my-auto">
                    <NutriCoachSymbol className="w-4 h-4 text-white drop-shadow-xs" />
                  </div>
                  {/* Measuring ticks */}
                  <div className="w-full flex flex-col gap-0.5 px-1 opacity-40">
                    <div className="w-3.5 h-0.5 bg-white rounded-full ml-auto" />
                    <div className="w-5 h-0.5 bg-white rounded-full ml-auto" />
                    <div className="w-3.5 h-0.5 bg-white rounded-full ml-auto" />
                  </div>
                </div>
              </div>

              {/* Dumbbell */}
              <div className="relative flex items-center justify-center shrink-0 mb-1">
                <div className="w-14 h-10 flex items-center justify-center">
                  <div className="w-3.5 h-8 bg-[#2b332c] dark:bg-[#191f1a] rounded-sm shadow-md" />
                  <div className="w-5 h-2.5 bg-[#5e695f] dark:bg-[#485349] rounded-xs shadow-inner" />
                  <div className="w-3.5 h-8 bg-[#2b332c] dark:bg-[#191f1a] rounded-sm shadow-md" />
                </div>
              </div>
            </div>

            {/* Footer Security Badge */}
            <div className="relative z-10 flex items-center gap-1.5 text-[11px] font-semibold text-[#5e6f5e] dark:text-[#A2AAA1] mt-2 select-none">
              <Lock className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              <span>Your data is safe with us</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL (Connected to real recovery flow)                   */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e8ede6] relative space-y-4">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-[#8e9f8e] hover:text-[#192418] hover:bg-[#f6f8f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                SECURITY VERIFICATION
              </span>
              <h3 className="text-xl font-extrabold text-[#192418]">
                Reset Your Password
              </h3>
              <p className="text-xs text-[#5e6f5e] mt-1 font-medium leading-relaxed">
                Enter your account email address and choose a new secure password. Your account will update immediately using client-side cryptographic hashing.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center space-y-1">
                <p>✓ Password Reset Successful!</p>
                <p className="font-normal text-[11px]">Returning to login form...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#192418] mb-1">
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:border-[#5ba83c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:border-[#5ba83c] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {forgotSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] font-bold text-xs border border-[#e8ede6]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
