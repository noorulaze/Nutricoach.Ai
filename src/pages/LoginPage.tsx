import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, X, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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

  // Google OAuth modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

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
    setIsSubmitting(true);

    const res = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Welcome back to NutriCoach AI!', 'success', 'Authenticated');
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
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
      showToast('Logged in as Alex Vance (Demo Account)', 'success', 'Demo Session');
      navigate('/', { replace: true });
    } else {
      setErrorMessage(res.error || 'Failed to initialize demo session');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitting(true);
    const res = await resetPassword(forgotEmail, newPassword);
    setForgotSubmitting(false);

    if (res.success) {
      setForgotSuccess(true);
      showToast('Password updated successfully! You can now log in.', 'success', 'Password Reset');
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSuccess(false);
        setEmail(forgotEmail);
        setPassword(newPassword);
      }, 1500);
    } else {
      showToast(res.error || 'Could not reset password', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-zinc-100 flex selection:bg-[#ccff00] selection:text-black">
      {/* DESKTOP LEFT COLUMN: High-Impact Cinematic Fitness Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border-subtle)]">
        {/* Background Image with Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/75 to-[#090a0f]/40 backdrop-blur-[2px]" />
        
        {/* Neon Ambient Glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(204,255,0,0.4)]">
            ⚡
          </div>
          <div>
            <span className="font-heading font-black text-white text-xl tracking-wider">
              NUTRICOACH <span className="text-[#ccff00]">AI</span>
            </span>
            <span className="block text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              Precision Fitness & Nutrition Platform
            </span>
          </div>
        </div>

        {/* Motivational Centerpiece */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 bg-[#ccff00]/10 border border-[#ccff00]/25 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
            <span className="text-xs font-mono text-[#ccff00] font-semibold uppercase tracking-wider">
              Personalized Human Performance
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight leading-none uppercase">
            Discipline over motivation. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-emerald-400">
              Science over guesswork.
            </span>
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            Take control of your daily macronutrient distribution, progressive overload schedule, and biological recovery with an intelligent system engineered specifically for your body.
          </p>

          {/* Social Proof / Capability Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-left font-mono">
            <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl backdrop-blur-md">
              <span className="text-[#ccff00] font-black text-lg block">99.4%</span>
              <span className="text-[10px] text-zinc-400 uppercase">Macro Precision</span>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl backdrop-blur-md">
              <span className="text-white font-black text-lg block">40+</span>
              <span className="text-[10px] text-zinc-400 uppercase">Compound Cues</span>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl backdrop-blur-md">
              <span className="text-emerald-400 font-black text-lg block">100%</span>
              <span className="text-[10px] text-zinc-400 uppercase">Client-Side Safe</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
          <span>Client-side cryptographic credential hashing & private storage isolation.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-7 animate-fade-in">
          {/* Mobile Brand Banner */}
          <div className="lg:hidden flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-[#ccff00] flex items-center justify-center text-black font-black text-sm">
              ⚡
            </div>
            <div>
              <span className="font-heading font-black text-white text-lg tracking-wider">
                NUTRICOACH <span className="text-[#ccff00]">AI</span>
              </span>
              <span className="block text-[10px] text-zinc-400 font-mono">
                Personal Nutrition & Fitness App
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
              SECURE PORTAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Log in to sync your food diary, workout split, and personal recovery metrics.
            </p>
          </div>

          {/* 1-Click Quick Demo Account Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-[#ccff00] font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Instant Demo Access
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Pre-configured
              </span>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              Evaluate with full sample nutrition data, workouts, and biometrics:
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white hover:text-[#ccff00] border border-zinc-700/80 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <span>Log in as Alex Vance (demo@nutricoach.ai)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ccff00]" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@nutricoach.ai"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#ccff00] hover:underline font-mono"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[#ccff00] accent-[#ccff00] focus:ring-0"
                />
                <span className="text-xs text-zinc-300 font-medium">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-[#090a0f] px-3 text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

          {/* Link to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#ccff00] font-bold hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in space-y-4">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                ACCOUNT RECOVERY
              </span>
              <h3 className="text-xl font-bold text-white">
                Reset Account Password
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your registered email and choose a new secure password.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Password Updated!</h4>
                <p className="text-xs text-zinc-300">Applying new credentials and redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="demo@nutricoach.ai"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    New Password (at least 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="flex-1 py-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                  >
                    {forgotSubmitting ? 'Updating...' : 'Save New Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GOOGLE OAUTH CONFIGURATION NOTICE MODAL */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in space-y-4">
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                G
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-400 tracking-widest block">
                  INTEGRATION NOTICE
                </span>
                <h3 className="text-lg font-bold text-white">
                  Google OAuth Configuration
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Google Single Sign-On requires a valid <code className="bg-zinc-900 text-[#ccff00] px-1 py-0.5 rounded font-mono text-[11px]">VITE_GOOGLE_CLIENT_ID</code> registered in Google Cloud Console.
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed">
              To proceed right now, please use the <strong>built-in secure email authentication</strong> or click the 1-click <strong>Instant Demo Access</strong> button above.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="w-full py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs rounded-xl transition-all"
              >
                Got it, use standard login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
