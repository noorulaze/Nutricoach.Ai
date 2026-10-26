import React, { useState } from 'react';
import { Sparkles, Key, Check, AlertCircle, X, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';
import { SocialProvider, OAuthConfig } from '../utils/socialAuth';

interface OAuthSetupModalProps {
  isOpen: boolean;
  provider: SocialProvider | null;
  config: OAuthConfig;
  onClose: () => void;
  onSaveConfig: (updated: Partial<OAuthConfig>) => void;
  onTestSandbox: (provider: SocialProvider, mockProfile?: { email: string; name: string }) => void;
}

export default function OAuthSetupModal({
  isOpen,
  provider,
  config,
  onClose,
  onSaveConfig,
  onTestSandbox
}: OAuthSetupModalProps) {
  const [clientIdInput, setClientIdInput] = useState('');
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testNameInput, setTestNameInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !provider) return null;

  const isGoogle = provider === 'google';
  const providerTitle = isGoogle ? 'Google OAuth 2.0' : 'Sign in with Apple';
  const currentVal = isGoogle ? config.googleClientId : config.appleClientId;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim()) {
      setErrorMessage(`Please enter a valid ${providerTitle} Client ID.`);
      return;
    }

    if (isGoogle) {
      onSaveConfig({ googleClientId: clientIdInput.trim() });
    } else {
      onSaveConfig({ appleClientId: clientIdInput.trim() });
    }

    setSavedSuccess(true);
    setErrorMessage(null);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSandboxSubmit = () => {
    const email = testEmailInput.trim() || (isGoogle ? 'athlete.google@example.com' : 'athlete.apple@example.com');
    const name = testNameInput.trim() || (isGoogle ? 'Google Athlete' : 'Apple Athlete');
    onClose();
    onTestSandbox(provider, { email, name });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white dark:bg-[#272E29] rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e8ede6] dark:border-[#394139] relative space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#8e9f8e] dark:text-[#7A8279] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#394139] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shrink-0">
            {isGoogle ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.77 1.04-1.84.93-2.92-.93.04-2.07.62-2.73 1.39-.58.67-1.09 1.76-.96 2.81 1.04.08 2.14-.51 2.76-1.28z" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#394139]">
              OAuth 2.0 Credentials
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7] mt-1 tracking-tight">
              {providerTitle} Setup
            </h3>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-3.5 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#5e6f5e] dark:text-[#A2AAA1] space-y-2">
          <p className="font-semibold text-[#192418] dark:text-[#E8EDE7]">
            {currentVal ? (
              <span className="text-[#3b7e23] dark:text-[#8BAF78] flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Configured: {currentVal.substring(0, 14)}...
              </span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Credential Configuration Required for Live OAuth
              </span>
            )}
          </p>
          <p className="text-[11px] leading-relaxed">
            {isGoogle ? (
              <>
                To trigger live Google account popups, create an <strong>OAuth 2.0 Client ID</strong> in your{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5ba83c] dark:text-[#8BAF78] underline font-bold inline-flex items-center gap-0.5"
                >
                  Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>{' '}
                with Authorized Javascript Origin <code className="bg-white dark:bg-[#272E29] px-1 py-0.5 rounded">{window.location.origin}</code>.
              </>
            ) : (
              <>
                To trigger live Sign in with Apple popups, register a <strong>Services ID</strong> in your{' '}
                <a
                  href="https://developer.apple.com/account/resources/identifiers/list/serviceId"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5ba83c] dark:text-[#8BAF78] underline font-bold inline-flex items-center gap-0.5"
                >
                  Apple Developer Account <ExternalLink className="w-3 h-3" />
                </a>{' '}
                with Web Domain <code className="bg-white dark:bg-[#272E29] px-1 py-0.5 rounded">{window.location.host}</code>.
              </>
            )}
          </p>
        </div>

        {/* Save Live Client ID Form */}
        <form onSubmit={handleSave} className="space-y-3">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#394139] text-[#3b7e23] dark:text-[#8BAF78] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Credentials saved successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
              {isGoogle ? 'Google OAuth Client ID' : 'Apple Services ID'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                placeholder={isGoogle ? 'e.g. 123456789-abc.apps.googleusercontent.com' : 'e.g. com.nutricoach.web'}
                className="flex-1 px-3 py-2 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#8BAF78]/30 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] text-white dark:text-[#161D15] text-xs font-bold shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {/* Test Sandbox Section */}
        <div className="pt-2 border-t border-[#e8ede6] dark:border-[#394139] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              <span>Test Verification Sandbox</span>
            </span>
            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1]">
              Simulates verified {isGoogle ? 'Google' : 'Apple'} login
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="email"
              value={testEmailInput}
              onChange={(e) => setTestEmailInput(e.target.value)}
              placeholder={isGoogle ? 'athlete.google@example.com' : 'athlete.apple@example.com'}
              className="px-3 py-2 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-1 focus:ring-[#8BAF78]"
            />
            <input
              type="text"
              value={testNameInput}
              onChange={(e) => setTestNameInput(e.target.value)}
              placeholder="Display Name (optional)"
              className="px-3 py-2 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-1 focus:ring-[#8BAF78]"
            />
          </div>

          <button
            type="button"
            onClick={handleSandboxSubmit}
            className="w-full py-2.5 px-4 rounded-xl bg-[#edf2ea] dark:bg-[#222823] hover:bg-[#e2ebd0] dark:hover:bg-[#2d382f] border border-[#d6ebd0] dark:border-[#394139] text-xs font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Run Sandbox {isGoogle ? 'Google' : 'Apple'} Sign-In Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
