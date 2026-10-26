import React, { useState } from 'react';
import { Sparkles, Key, Check, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { getProfile, saveProfile } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

interface ApiKeySetupBannerProps {
  isAIGenerated?: boolean;
  needsApiKey?: boolean;
  onKeySaved?: () => void;
}

export default function ApiKeySetupBanner({
  isAIGenerated = false,
  needsApiKey = false,
  onKeySaved
}: ApiKeySetupBannerProps) {
  const { showToast } = useToast();
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  if (isDismissed) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    const profile = getProfile();
    profile.geminiApiKey = apiKeyInput.trim();
    saveProfile(profile);

    showToast('Gemini API key saved securely in your profile!', 'success', 'AI Key Configured');
    setModalOpen(false);
    if (onKeySaved) onKeySaved();
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#eef7eb] via-[#f4f9f2] to-[#eaf5e7] dark:from-[#212921] dark:via-[#242E25] dark:to-[#1F2720] border border-[#d6ebd0] dark:border-[#384639] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5ba83c]/15 text-[#3b7e23] dark:text-[#8BAF78] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78]">
                {isAIGenerated ? 'POWERED BY GOOGLE GEMINI AI' : 'AUTHENTIC CULINARY ENGINE'}
              </span>
              <span className="text-[10px] font-bold text-[#7a8c79] dark:text-[#A2AAA1]">
                {isAIGenerated ? 'Active' : 'ICMR-NIN & USDA Standard'}
              </span>
            </div>
            <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] mt-0.5 leading-snug">
              {isAIGenerated
                ? 'Your meal plan was uniquely synthesized with live multimodal nutrition intelligence.'
                : 'Formulated from verified authentic recipes. To enable real-time Gemini generation, configure your API key.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {!isAIGenerated && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C211D] border border-[#d6ebd0] dark:border-[#394139] hover:border-[#5ba83c] text-xs font-bold text-[#192418] dark:text-[#E8EDE7] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#5ba83c]" />
              <span>Configure AI Key</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-[#7a8c79] hover:text-[#192418] dark:text-[#A2AAA1] rounded-lg cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Setup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#eef7eb] dark:bg-[#243022] text-[#5ba83c] flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#192418] dark:text-[#E8EDE7]">
                    Configure Google Gemini API Key
                  </h3>
                  <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
                    Empower NutriCoach AI with live generation
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#7a8c79] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
              You can get a free Google Gemini API key at{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-[#5ba83c] hover:underline"
              >
                Google AI Studio
              </a>
              . Your key is stored strictly on your device or in server environment variables.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  required
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] dark:text-[#E8EDE7] font-mono focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-extrabold uppercase shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
