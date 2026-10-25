import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
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

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-[#ccff00]' };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please acknowledge the terms of use and privacy notice to continue.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(name, email, password);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Account registered successfully! Welcome to NutriCoach AI.', 'success', 'Account Created');
      // Newly created users are guided directly through the onboarding setup flow
      navigate('/onboarding', { replace: true });
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
      showToast(res.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-zinc-100 flex selection:bg-[#ccff00] selection:text-black">
      {/* DESKTOP LEFT COLUMN: Cinematic Imagery & Platform Features */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border-subtle)]">
        {/* Background Image with Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-[#090a0f]/45 backdrop-blur-[2px]" />

        {/* Neon Ambient Glow */}
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

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
              Personal Fitness & Nutrition Platform
            </span>
          </div>
        </div>

        {/* Motivational Centerpiece */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 bg-[#ccff00]/10 border border-[#ccff00]/25 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
            <span className="text-xs font-mono text-[#ccff00] font-semibold uppercase tracking-wider">
              Start Your Private Transformation
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight leading-none uppercase">
            Built for individual progress. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-emerald-400">
              Never for comparisons.
            </span>
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            Join NutriCoach AI to customize your daily nutrition targets, plan muscle-building or fat-loss workout splits, and consult your private fitness advisor.
          </p>

          {/* Core Feature Pillars */}
          <div className="space-y-3 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-3 text-xs text-zinc-200">
              <div className="w-5 h-5 rounded-full bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>Mifflin-St Jeor BMR & TDEE Modeling:</strong> Real metabolic targets, not arbitrary caloric baselines.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-200">
              <div className="w-5 h-5 rounded-full bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>Dynamic Workout Splits:</strong> Custom progressive overload routines tailored to your available gear.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-200">
              <div className="w-5 h-5 rounded-full bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>100% Client-Side Private Storage:</strong> Your biometrics, photos, and meal logs remain strictly on this device.</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
          <span>No third-party trackers, advertisements, or public feed comparisons.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
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
              GET STARTED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Step into a smarter, evidence-backed approach to training and nutrition.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder="jordan@example.com"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Security strength:</span>
                    <span className="text-zinc-300 font-semibold">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full bg-zinc-900 border rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                    confirmPassword && !passwordsMatch 
                      ? 'border-red-500/80 focus:border-red-500' 
                      : 'border-zinc-700/80 focus:border-[#ccff00]'
                  }`}
                />
                {confirmPassword && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[#ccff00] accent-[#ccff00] focus:ring-0 mt-0.5"
                />
                <span className="text-xs text-zinc-400 leading-snug">
                  I acknowledge that NutriCoach AI is an educational fitness & nutrition tool, and agree to the private local storage terms.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !agreeTerms}
              className="w-full py-3.5 px-4 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Setup Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#ccff00] font-bold hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
