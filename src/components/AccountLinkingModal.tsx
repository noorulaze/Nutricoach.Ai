import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, X, ArrowRight } from 'lucide-react';
import { AccountLinkingContext } from '../utils/socialAuth';

interface AccountLinkingModalProps {
  isOpen: boolean;
  context: AccountLinkingContext | null;
  onClose: () => void;
  onConfirmLink: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AccountLinkingModal({
  isOpen,
  context,
  onClose,
  onConfirmLink
}: AccountLinkingModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !context) return null;

  const providerName = context.provider === 'google' ? 'Google' : 'Apple';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your account password to verify ownership.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await onConfirmLink(password);
      if (!res.success) {
        setErrorMessage(res.error || 'Password verification failed. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to verify account';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white dark:bg-[#272E29] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e8ede6] dark:border-[#394139] relative space-y-5 animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#8e9f8e] dark:text-[#7A8279] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Badge Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#394139] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#394139]">
              Account Linking Protection
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7] mt-1 tracking-tight">
              Existing Account Found
            </h3>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs sm:text-[13px] text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
          An account registered with <strong className="text-[#192418] dark:text-[#E8EDE7] font-bold">{context.email}</strong> already exists on NutriCoach AI.
        </p>

        <div className="p-3.5 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#5e6f5e] dark:text-[#A2AAA1] space-y-1">
          <p className="font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
            <span>Why is password verification required?</span>
          </p>
          <p className="text-[11px] leading-relaxed text-[#7a8c79] dark:text-[#A2AAA1]">
            To protect your private nutrition logs, workouts, and biometrics from unauthorized access, NutriCoach AI never merges accounts automatically without explicit verification.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1.5">
              Enter Password for {context.email}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Account password"
                className="w-full px-4 py-2.5 pr-11 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs sm:text-sm text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#8BAF78]/30 focus:border-[#8BAF78] transition-all font-medium"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9f8e] dark:text-[#7A8279] hover:text-[#192418] dark:hover:text-[#E8EDE7]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] text-white dark:text-[#161D15] text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Verify & Link {providerName}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
