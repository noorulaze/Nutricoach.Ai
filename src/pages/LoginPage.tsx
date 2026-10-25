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

export default function LoginPage() {
  const { login, resetPassword, isAuthenticated } = useAuth();
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

  // Social OAuth modal / informational prompt
  const [socialModalInfo, setSocialModalInfo] = useState<{ open: boolean; provider: 'Google' | 'Apple' | null }>({
    open: false,
    provider: null
  });

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

  const handleSocialClick = (provider: 'Google' | 'Apple') => {
    setSocialModalInfo({ open: true, provider });
  };

  const handleSocialDemoConfirm = async () => {
    setSocialModalInfo({ open: false, provider: null });
    await handleQuickDemoLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f5] text-[#192418] flex flex-col lg:flex-row relative selection:bg-[#5ba83c]/20 font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT SECTION: Branded Wellness Presentation (matches reference image)     */}
      {/* ========================================================================= */}
      <AuthWellnessBanner />

      {/* ========================================================================= */}
      {/* RIGHT SECTION: The Elevated Clean White Login Card                         */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[46%] xl:w-[44%] flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-14 bg-[#f6f8f5]">
        <div className="w-full max-w-[460px] bg-white border border-[#e8ede6] rounded-[32px] p-6 sm:p-9 shadow-[0_12px_40px_-8px_rgba(25,36,24,0.06)] animate-fade-in space-y-6">
          
          {/* Top Card Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#5ba83c] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M21 3c-6.627 0-12 5.373-12 12 0 1.258.196 2.47.558 3.606L3 21l2.394-6.558C4.196 13.31 4 12.098 4 11 4 4.373 9.373-1 16-1c2.146 0 4.148.566 5.88 1.558L21 3z" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-lg text-[#192418] tracking-tight">
                NutriCoach <span className="text-[#5ba83c]">AI</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-[26px] font-black text-[#192418] tracking-tight">
              Welcome back!
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5e6f5e] font-medium mt-1">
              Log in to continue your health journey.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('Google')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f9fbf8] border border-[#e2e8df] hover:border-[#cbd7c8] text-xs font-bold text-[#192418] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99]"
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

            {/* Apple Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('Apple')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f9fbf8] border border-[#e2e8df] hover:border-[#cbd7c8] text-xs font-bold text-[#192418] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99]"
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

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1.5">
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
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#192418] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-white border border-[#e8ede6] rounded-2xl pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-[#8e9f8e] hover:text-[#192418] absolute right-3 top-1/2 -translate-y-1/2 rounded-lg transition-colors"
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
                  className="w-4 h-4 rounded text-[#5ba83c] border-[#cbd7c8] focus:ring-[#5ba83c] accent-[#5ba83c] cursor-pointer"
                />
                <span className="font-semibold text-[#5e6f5e]">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotModalOpen(true);
                }}
                className="text-xs font-bold text-[#5ba83c] hover:text-[#46822c] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-[#7cb342] hover:bg-[#6ea935] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="text-center text-xs text-[#5e6f5e] font-medium pt-1">
            <span>Don't have an account? </span>
            <Link
              to="/signup"
              className="font-bold text-[#5ba83c] hover:text-[#46822c] hover:underline"
            >
              Sign up
            </Link>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] border border-[#e8ede6] text-[#5e6f5e] hover:text-[#192418] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5ba83c]" />
              <span>1-Click Demo Login (Alex Vance)</span>
            </button>
          </div>

          {/* Bottom Encouragement Card matching mockup */}
          <div className="bg-[#f2f7ef] border border-[#d8e8d5] rounded-2xl p-4 flex items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              {/* Robot Avatar Mascot */}
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#d8e8d5] flex items-center justify-center text-[#5ba83c] shrink-0 shadow-xs">
                <Bot className="w-5 h-5 text-[#5ba83c]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#192418] block leading-tight">
                  New to NutriCoach AI?
                </span>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-0.5 leading-snug">
                  Create your account and start your healthy journey today.
                </p>
              </div>
            </div>

            <Link
              to="/signup"
              className="w-8 h-8 rounded-full bg-white hover:bg-[#eaf4e6] border border-[#d8e8d5] text-[#192418] flex items-center justify-center shrink-0 shadow-xs transition-colors"
              title="Create Account"
            >
              <ArrowRight className="w-4 h-4 text-[#192418]" />
            </Link>
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
      {/* SOCIAL OAUTH NOTICE MODAL                                                 */}
      {/* ========================================================================= */}
      {socialModalInfo.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#e8ede6] relative space-y-4 text-center">
            <button
              type="button"
              onClick={() => setSocialModalInfo({ open: false, provider: null })}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#8e9f8e] hover:text-[#192418]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#eef7eb] flex items-center justify-center text-[#5ba83c]">
              <Sparkles className="w-6 h-6 text-[#5ba83c]" />
            </div>

            <h3 className="text-lg font-extrabold text-[#192418]">
              {socialModalInfo.provider} Sign-In
            </h3>

            <p className="text-xs text-[#5e6f5e] leading-relaxed">
              In this client-side environment, third-party {socialModalInfo.provider} OAuth uses simulated single sign-on. You can continue as a verified user with 1 click.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSocialDemoConfirm}
                className="w-full py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs shadow-xs"
              >
                Continue with {socialModalInfo.provider} Demo
              </button>
              <button
                type="button"
                onClick={() => setSocialModalInfo({ open: false, provider: null })}
                className="w-full py-2 text-xs text-[#7a8c79] hover:text-[#192418]"
              >
                Use Email & Password Instead
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
