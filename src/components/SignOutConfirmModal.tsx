import React, { useEffect } from 'react';
import { LogOut, ShieldCheck, X } from 'lucide-react';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function SignOutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = 'User'
}: SignOutConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-modal-title"
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8ede6] relative space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7a8c79] hover:text-[#192418] hover:bg-[#f6f8f5] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
            <LogOut className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="pr-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              Session Termination
            </span>
            <h3 id="sign-out-modal-title" className="text-lg font-extrabold text-[#192418] tracking-tight mt-1">
              Sign out of NutriCoach AI?
            </h3>
            <p className="text-xs text-[#5e6f5e] mt-0.5 font-medium">
              See you soon, {userName}.
            </p>
          </div>
        </div>

        {/* Data Preservation Reassurance Card */}
        <div className="bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2d6a1b]">
            <ShieldCheck className="w-4 h-4 text-[#5ba83c] shrink-0" />
            <span>Your personal fitness data is 100% preserved</span>
          </div>
          <p className="text-xs text-[#5e6f5e] leading-relaxed">
            Signing out terminates your current active session token on this device. 
            <strong> All your logged foods, custom recipes, workout schedules, and progress entries remain safely stored</strong> under your account. You can log back in at any time to resume.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-[#5e6f5e] hover:text-[#192418] hover:bg-[#edf2ea] transition-colors"
          >
            Stay Signed In
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 stroke-[2.2]" />
            <span>Sign Out Safely</span>
          </button>
        </div>
      </div>
    </div>
  );
}
