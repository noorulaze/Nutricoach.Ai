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
  AlertCircle, 
  X,
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthWellnessBanner from '../components/AuthWellnessBanner';

export default function SignupPage() {
  const { signup, isAuthenticated, login } = useAuth();
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

  // Social OAuth modal info
  const [socialModalInfo, setSocialModalInfo] = useState<{ open: boolean; provider: 'Google' | 'Apple' | null }>({
    open: false,
    provider: null
  });

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

  const handleSocialClick = (provider: 'Google' | 'Apple') => {
    setSocialModalInfo({ open: true, provider });
  };

  const handleSocialDemoConfirm = async () => {
    setSocialModalInfo({ open: false, provider: null });
    setIsSubmitting(true);
    const res = await login('demo@nutricoach.ai', 'Password123!', true);
    setIsSubmitting(false);
    if (res.success) {
      showToast('Logged in as Alex Vance (Verified Session)', 'success', 'Welcome');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f5] text-[#192418] flex flex-col lg:flex-row relative selection:bg-[#5ba83c]/20 font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT SECTION: Branded Wellness Presentation (matches reference image)     */}
      {/* ========================================================================= */}
      <AuthWellnessBanner />

      {/* ========================================================================= */}
      {/* RIGHT SECTION: The Elevated Clean White Registration Card                 */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[46%] xl:w-[44%] flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-14 bg-[#f6f8f5]">
        <div className="w-full max-w-[460px] bg-white border border-[#e8ede6] rounded-[32px] p-6 sm:p-9 shadow-[0_12px_40px_-8px_rgba(25,36,24,0.06)] animate-fade-in space-y-5">
          
          {/* Top Card Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
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
              Create your account
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5e6f5e] font-medium mt-0.5">
              Start your personalized health and fitness journey.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2">
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
              <span>Sign up with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialClick('Apple')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f9fbf8] border border-[#e2e8df] hover:border-[#cbd7c8] text-xs font-bold text-[#192418] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.77 1.04-1.84.93-2.92-.93.04-2.07.62-2.73 1.39-.58.67-1.09 1.76-.96 2.81 1.04.08 2.14-.51 2.76-1.28z" />
              </svg>
              <span>Sign up with Apple</span>
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

      {/* Social OAuth Modal */}
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
              {socialModalInfo.provider} Sign-Up
            </h3>

            <p className="text-xs text-[#5e6f5e] leading-relaxed">
              In this client-side environment, third-party {socialModalInfo.provider} OAuth is simulated. You can instantly access the demo account with 1 click.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSocialDemoConfirm}
                className="w-full py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs shadow-xs"
              >
                Sign Up with {socialModalInfo.provider} Demo
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
