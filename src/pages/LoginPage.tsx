import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, X, Utensils, 
  Dumbbell, TrendingUp, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import loginBg from '../assets/login-bg.jpg';

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
    <div className="min-h-screen w-full bg-[#090a0f] text-zinc-100 flex flex-col lg:flex-row relative selection:bg-[#ccff00] selection:text-black font-sans">
      
      {/* ========================================================================= */}
      {/* DESKTOP LEFT COLUMN: Cinematic Athlete Imagery + Brand Messaging          */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[58%] min-h-[460px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800/80">
        
        {/* Background Athlete Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-transform duration-1000 scale-[1.02]"
          style={{ backgroundImage: `url(${loginBg})` }}
        />

        {/* Ambient Dark Gradients (dark on left, smooth fade to right border) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/40 lg:to-[#090a0f] pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent to-[#090a0f] pointer-events-none" />

        {/* Top-Left: Logo & Subtitle */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ccff00] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(204,255,0,0.4)]">
            {/* Custom 4-point fitness star glyph */}
            <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white">
                NUTRI<span className="text-[#ccff00]">COACH</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#ccff00]/15 text-[#ccff00] px-1.5 py-0.5 rounded border border-[#ccff00]/40">
                AI
              </span>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase mt-1 block">
              PERSONAL FITNESS & NUTRITION COACH
            </span>
          </div>
        </div>

        {/* Center / Lower-Left: Bold Motto & Feature Pillars */}
        <div className="relative z-10 max-w-xl space-y-7 my-auto pt-12 pb-6">
          {/* Main Hero Typography */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.05] italic uppercase">
              <span className="text-white block">BETTER FOOD.</span>
              <span className="text-[#ccff00] block">STRONGER YOU.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 italic font-normal mt-3 leading-relaxed">
              Track your nutrition. Follow your workouts.<br className="hidden sm:inline" />
              Build a healthier, stronger you — with AI.
            </p>
          </div>

          {/* 4 Feature Items (Matches the mockup layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="flex flex-col items-start gap-1.5">
              <Utensils className="w-5 h-5 text-[#ccff00]" />
              <span className="text-xs font-semibold text-zinc-200 leading-snug">
                Track<br />Nutrition
              </span>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <Dumbbell className="w-5 h-5 text-[#ccff00]" />
              <span className="text-xs font-semibold text-zinc-200 leading-snug">
                Plan<br />Workouts
              </span>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <TrendingUp className="w-5 h-5 text-[#ccff00]" />
              <span className="text-xs font-semibold text-zinc-200 leading-snug">
                Monitor<br />Progress
              </span>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <Sparkles className="w-5 h-5 text-[#ccff00]" />
              <span className="text-xs font-semibold text-zinc-200 leading-snug">
                Get AI<br />Coaching
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer Tag */}
        <div className="relative z-10 flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          <span>SMALL STEPS</span>
          <span className="text-zinc-700">/</span>
          <span>BIG CHANGES</span>
          <div className="h-px bg-zinc-800 flex-1 max-w-[140px]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Authentication Form + Diagonal Accent Streaks              */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[42%] min-h-screen bg-[#090a0f] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        
        {/* Subtle Diagonal Neon Streaks (Matches the mockup graphics in corners) */}
        <svg 
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-30 text-[#ccff00]" 
          viewBox="0 0 200 200" 
          fill="none"
        >
          <line x1="160" y1="0" x2="200" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="130" y1="0" x2="200" y2="70" stroke="currentColor" strokeWidth="1.5" />
          <line x1="100" y1="0" x2="200" y2="100" stroke="currentColor" strokeWidth="1.5" />
          <line x1="170" y1="0" x2="200" y2="30" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
        </svg>

        <svg 
          className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none opacity-20 text-[#ccff00]" 
          viewBox="0 0 200 200" 
          fill="none"
        >
          <line x1="0" y1="160" x2="40" y2="200" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="130" x2="70" y2="200" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="100" x2="100" y2="200" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Top-Right: Quick Sign Up Link */}
        <div className="relative z-10 flex justify-end items-center text-xs text-zinc-400">
          <span>Don't have an account? </span>
          <Link 
            to="/signup" 
            className="text-[#ccff00] font-bold ml-1.5 hover:underline inline-flex items-center gap-1 transition-all"
          >
            Sign Up <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Center: Card Content */}
        <div className="relative z-10 w-full max-w-sm mx-auto my-auto py-8 space-y-6 animate-fade-in">
          
          {/* NutriCoach Logo Header inside the right panel */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ccff00] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(204,255,0,0.35)]">
              <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading font-black text-xl tracking-wider text-white">
                  NUTRI<span className="text-[#ccff00]">COACH</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#ccff00]/15 text-[#ccff00] px-1.5 py-0.5 rounded border border-[#ccff00]/40">
                  AI
                </span>
              </div>
              <span className="text-[8px] font-bold text-zinc-400 tracking-widest uppercase mt-0.5 block">
                PERSONAL FITNESS & NUTRITION COACH
              </span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Your goals. Our AI. A healthier you.
            </p>
          </div>

          {/* 1-Click Demo Login Pill */}
          <div className="bg-[#11131a] border border-zinc-800/80 hover:border-[#ccff00]/40 rounded-xl p-3 flex items-center justify-between gap-2 transition-all">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
              <span className="text-[11px] font-mono text-zinc-300">
                Demo Account: <strong>Alex Vance</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="text-[11px] font-mono text-[#ccff00] hover:underline font-bold px-2 py-0.5 rounded hover:bg-[#ccff00]/10 transition-colors"
            >
              Instant Login →
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with embedded label */}
            <div className="bg-[#11141c] border border-zinc-800 focus-within:border-[#ccff00]/60 rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-colors shadow-sm">
              <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 leading-tight">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field with embedded label & show/hide toggle */}
            <div className="bg-[#11141c] border border-zinc-800 focus-within:border-[#ccff00]/60 rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-colors shadow-sm">
              <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 leading-tight">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#11141c] border-zinc-700 text-[#ccff00] accent-[#ccff00] focus:ring-0"
                />
                <span className="text-zinc-300 font-medium text-xs">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[#ccff00] hover:underline font-medium text-xs"
              >
                Forgot password?
              </button>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#090a0f] px-3 text-zinc-500">OR</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 px-4 bg-[#11141c] hover:bg-[#161a24] border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 flex items-center justify-center gap-3 transition-colors cursor-pointer"
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

          {/* Bottom Link to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              New to NUTRICOACH AI?{' '}
              <Link 
                to="/signup" 
                className="text-[#ccff00] font-bold hover:underline inline-flex items-center gap-1 transition-colors"
              >
                Create an account <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Empty bottom spacer to balance layout */}
        <div className="hidden lg:block h-6" />
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL                                                     */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#10131a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
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
                Enter your registered email and specify a new secure password.
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

      {/* ========================================================================= */}
      {/* GOOGLE OAUTH CONFIGURATION NOTICE MODAL                                   */}
      {/* ========================================================================= */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#10131a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
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
              To log in right now, please use the <strong>built-in secure email authentication</strong> or click the 1-click <strong>Instant Login</strong> button above.
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
