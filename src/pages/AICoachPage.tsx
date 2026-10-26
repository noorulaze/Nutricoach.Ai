import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, ShieldCheck, 
  RotateCcw, AlertCircle, Lightbulb, Trash2,
  Copy, Check, Square, Plus, Settings, Key,
  Utensils, CheckCircle2, ChevronDown, X, Code, Flame
} from 'lucide-react';
import { 
  getProfile, saveProfile, getFoodLog, addFoodEntry, 
  getWorkoutPlan, getProgressEntries, getUserScopedKey, 
  STORAGE_KEYS, getTodayKey 
} from '../utils/storage';
import { generateCoachReply, ConversationTurn } from '../utils/aiCoachEngine';
import { ChatMessage, ChatFoodCard, MealType } from '../types';
import { NutriCoachSymbol } from '../components/NutriCoachLogo';

export default function AICoachPage() {
  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();
  const chatStorageKey = getUserScopedKey(STORAGE_KEYS.CHAT_HISTORY);

  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Stop Generation Abort Controller
  const abortControllerRef = useRef<AbortController | null>(null);

  const isGeminiOnline = Boolean(
    (profile.geminiApiKey && profile.geminiApiKey.trim().length > 10) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY)
  );

  const initialGreeting: ChatMessage = {
    id: 'msg_welcome',
    sender: 'ai',
    text: `Hello ${profile.name}! I am **NutriCoach AI** — your versatile personal wellness companion and general-purpose AI assistant 🌱

I specialize in:
• **Personalized Fitness & Macros:** Tailored to your **${profile.goal.replace('_', ' ').toUpperCase()}** goal (${profile.calorieTarget} kcal budget • ${profile.proteinTargetGrams}g Protein target)
• **Kerala & Regional Indian Cuisine:** Verified nutritional analysis for **70+ authentic curries** (Nadan Chicken, Beef Roast, Kudampuli Meen, Kadala, Avial, Thoran, Sambar, Dals, and more) with 1-click food tracking
• **General AI Intelligence:** I am here to help you with **computer programming (Python, TypeScript, React, SQL), mathematics, science, writing, creative ideas, and daily life questions**!

Ask me anything — from reviewing your meals today or fitting a curry into your macros, to solving a coding bug or explaining a complex topic!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [initialGreeting];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<'curries' | 'nutrition' | 'tech' | 'general'>('curries');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, isTyping, chatStorageKey]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Quick Suggestion Prompts by Category
  const promptCategories = {
    curries: [
      'How many calories in Kerala Nadan Chicken Curry?',
      'How do I fit Puttu and Kadala curry into my macros?',
      'Tell me about Kudampuli Meen Mulakittathu nutrition',
      'What are the macros for Avial and Sambar?'
    ],
    nutrition: [
      'Analyze my nutrition gaps and remaining macros today',
      'What foods will give me 30g protein for dinner?',
      'How does dietary fiber affect satiety and gut health?',
      'How much water should I drink based on my weight?'
    ],
    tech: [
      'Write a Python script to filter and sort food records',
      'Explain useEffect and state management in React with an example',
      'How does an asynchronous Promise work in TypeScript?',
      'Write an optimized SQL query for daily aggregated totals'
    ],
    general: [
      'Solve this linear equation step by step: 3x + 15 = 60',
      'Explain the first law of thermodynamics in human metabolism',
      'Draft a polite, professional email requesting a gym membership pause',
      'What are the key physiological stages of sleep for recovery?'
    ]
  };

  // Send Message Handler
  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    // Create abort controller for "Stop Generating"
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Build conversation context
    const conversationHistory: ConversationTurn[] = messages.slice(-8).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const reply = await generateCoachReply(
        text,
        profile,
        todayFoods,
        workoutPlan,
        progressEntries,
        conversationHistory,
        abortController.signal
      );

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        foodCard: reply.foodCard
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const stoppedMsg: ChatMessage = {
          id: 'msg_stop_' + Date.now(),
          sender: 'ai',
          text: '_Generation stopped by user._',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, stoppedMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: 'msg_err_' + Date.now(),
          sender: 'ai',
          text: 'I encountered an issue processing that query. Please click "Retry" below or try rephrasing your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  // Stop Generating
  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Retry previous user message
  const handleRetryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  // Copy Message to Clipboard
  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      showToast('Copied message to clipboard!', 'info');
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  // Start New Conversation
  const handleNewConversation = () => {
    setMessages([initialGreeting]);
    localStorage.removeItem(chatStorageKey);
    showToast('Started new conversation', 'info');
  };

  // Save API Key
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = { ...profile, geminiApiKey: geminiApiKey.trim() };
    saveProfile(updatedProfile);
    setIsApiKeyModalOpen(false);
    showToast(geminiApiKey.trim() ? 'Google Gemini API key connected!' : 'Switched to Local Hybrid Engine', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#192418] text-white text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8BAF78]" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Connectivity Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e8ede6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
              ASSISTANT & WELLNESS COACH
            </span>
            <span className="text-xs text-[#7a8c79] font-medium hidden sm:inline">
              General Intelligence • Kerala Curries • Nutrition
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#192418] tracking-tight">
            NutriCoach AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
            Ask about foods, curries, code, mathematics, science, writing, workouts, and daily fitness.
          </p>
        </div>

        {/* Action Controls & Model Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e8ede6] bg-white hover:bg-[#f6f8f5] text-xs font-semibold text-[#192418] transition-colors shadow-xs"
            title="Configure Gemini Cloud Model"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isGeminiOnline ? 'bg-[#5ba83c] shadow-xs' : 'bg-emerald-600'
              }`}
            />
            <span>{isGeminiOnline ? 'Gemini 2.5 Flash' : 'Smart Hybrid Engine'}</span>
            <Key className="w-3 h-3 text-[#7a8c79]" />
          </button>

          <button
            type="button"
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e8ede6] bg-white hover:bg-[#f6f8f5] text-xs font-semibold text-[#5e6f5e] hover:text-[#192418] transition-colors shadow-xs"
            title="Start new conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white border border-[#e8ede6] rounded-3xl overflow-hidden shadow-xs flex flex-col h-[650px] sm:h-[680px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 bg-[#fcfdfc]">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isLastMessage = index === messages.length - 1;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 sm:gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold transition-transform shadow-xs ${
                    isUser
                      ? 'bg-[#5ba83c] text-white'
                      : 'bg-[#eef7eb] border border-[#d6ebd0] text-[#3b7e23]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <NutriCoachSymbol className="w-4 h-4" />}
                </div>

                {/* Message Bubble + Action Bar */}
                <div className="flex flex-col space-y-1.5 max-w-[88%] sm:max-w-2xl">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                      isUser
                        ? 'bg-[#5ba83c] text-white font-medium rounded-tr-none'
                        : msg.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none font-medium'
                        : 'bg-[#f6f8f5] border border-[#e8ede6] text-[#192418] rounded-tl-none font-medium'
                    }`}
                  >
                    {/* Render Formatted Markdown / Text Content */}
                    <FormattedMessageContent content={msg.text} isUser={isUser} />

                    {/* Interactive Food Card Widget (if food/curry detected) */}
                    {msg.foodCard && (
                      <div className="mt-3.5 pt-3 border-t border-[#e8ede6]">
                        <InteractiveFoodWidget 
                          foodCard={msg.foodCard} 
                          onFoodLogged={(foodName, meal) => {
                            showToast(`Logged ${foodName} to ${meal}!`, 'success');
                          }}
                        />
                      </div>
                    )}

                    {/* Timestamp & Error Retry Button */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                      <span
                        className={`text-[10px] font-medium block ${
                          isUser ? 'text-white/80' : 'text-[#8e9f8e]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>

                      {!isUser && (
                        <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="p-1 rounded-md hover:bg-black/5 text-[#7a8c79] hover:text-[#192418] transition-colors"
                            title="Copy message text"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-[#5ba83c]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {(msg.isError || isLastMessage) && (
                            <button
                              type="button"
                              onClick={handleRetryLastMessage}
                              className="p-1 rounded-md hover:bg-black/5 text-[#7a8c79] hover:text-[#192418] transition-colors flex items-center gap-1 text-[10px]"
                              title="Retry generation"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span className="hidden sm:inline">Retry</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator with Stop Generating Option */}
          {isTyping && (
            <div className="flex items-center justify-between gap-2 pl-9 pr-2">
              <div className="flex items-center gap-2 text-xs text-[#5e6f5e] font-medium">
                <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[#7a8c79]">NutriCoach is thinking...</span>
              </div>

              <button
                type="button"
                onClick={handleStopGenerating}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Generating</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts Bar with Category Switcher */}
        <div className="px-3.5 py-2.5 border-t border-[#e8ede6] bg-[#f9fbf8] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] font-bold">
              <span className="text-[10px] text-[#7a8c79] uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-500" /> PROMPTS:
              </span>
              {[
                { key: 'curries', label: '🍛 Curries & Food' },
                { key: 'nutrition', label: '🥗 Macros & Health' },
                { key: 'tech', label: '💻 Coding & Tech' },
                { key: 'general', label: '📚 Science & Life' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveSuggestionCategory(cat.key as any)}
                  className={`px-2 py-0.5 rounded-lg transition-colors shrink-0 ${
                    activeSuggestionCategory === cat.key
                      ? 'bg-[#192418] text-white'
                      : 'text-[#5e6f5e] hover:text-[#192418] bg-white border border-[#e8ede6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex items-center gap-2 pb-0.5 scrollbar-none">
            {promptCategories[activeSuggestionCategory].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="bg-white hover:bg-[#eef7eb] hover:text-[#3b7e23] text-[#5e6f5e] text-xs px-3 py-1 rounded-xl border border-[#e8ede6] whitespace-nowrap transition-colors font-medium shadow-xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e8ede6]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#5ba83c]/30 focus-within:border-[#5ba83c] transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask anything (food, curry nutrition, code in Python/React, math, science, daily questions)..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#5ba83c] hover:bg-[#4d9630] disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-xs shrink-0 active:scale-95 flex items-center justify-center"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#7a8c79] mt-2 px-1 font-medium">
            <span className="hidden sm:inline">
              Press <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Shift + Enter</kbd> for new line.
            </span>
            <span className="sm:hidden">English responses • AI education</span>
            <button
              type="button"
              onClick={handleNewConversation}
              className="text-[#7a8c79] hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear history
            </button>
          </div>
        </div>
      </div>

      {/* Google Gemini API Key Settings Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#5ba83c]" />
                <h3 className="text-base font-bold text-[#192418]">
                  Gemini Cloud Model Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1 rounded-xl text-[#7a8c79] hover:text-[#192418]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5e6f5e] leading-relaxed">
              NutriCoach AI includes a fast, zero-latency local hybrid engine. If you want open-ended live cloud generative reasoning for general-purpose knowledge, you can provide a free Google Gemini API key.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#192418] uppercase tracking-wider mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3 py-2 text-xs text-[#192418] focus:outline-none focus:border-[#5ba83c]"
                />
              </div>

              <div className="text-[11px] text-[#7a8c79]">
                Your key is stored strictly on your local browser device. You can get a free key at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5ba83c] font-bold hover:underline"
                >
                  Google AI Studio
                </a>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5e6f5e] hover:bg-[#f6f8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Food Card Widget embedded directly in AI chat messages.
 * Allows user to pick serving size, preview live macros, select meal category, and log to tracker.
 */
function InteractiveFoodWidget({ 
  foodCard, 
  onFoodLogged 
}: { 
  foodCard: ChatFoodCard; 
  onFoodLogged: (foodName: string, meal: string) => void;
}) {
  const [selectedServing, setSelectedServing] = useState(foodCard.defaultServing || foodCard.servings[0]);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [isLogged, setIsLogged] = useState(false);

  const factor = (selectedServing?.grams || 100) / 100;
  const currentNutrition = {
    calories: Math.round(foodCard.per100g.calories * factor),
    protein: Math.round(foodCard.per100g.protein * factor * 10) / 10,
    carbs: Math.round(foodCard.per100g.carbs * factor * 10) / 10,
    fat: Math.round(foodCard.per100g.fat * factor * 10) / 10,
    fiber: Math.round(foodCard.per100g.fiber * factor * 10) / 10
  };

  const handleLogFood = () => {
    addFoodEntry(getTodayKey(), {
      name: foodCard.name,
      meal: selectedMeal,
      portion: selectedServing.label,
      grams: selectedServing.grams,
      calories: currentNutrition.calories,
      protein: currentNutrition.protein,
      carbs: currentNutrition.carbs,
      fat: currentNutrition.fat,
      fiber: currentNutrition.fiber
    });

    setIsLogged(true);
    onFoodLogged(foodCard.name, selectedMeal);
  };

  return (
    <div className="bg-white border border-[#e8ede6] rounded-2xl p-3.5 space-y-3 shadow-xs text-left">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-full border border-[#d6ebd0]">
              {foodCard.cuisine.toUpperCase()} • {foodCard.category.replace('_', ' ')}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
              foodCard.dietaryType === 'vegetarian' || foodCard.dietaryType === 'vegan'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : foodCard.dietaryType === 'pescatarian'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {foodCard.dietaryType === 'vegetarian' ? 'Veg' : foodCard.dietaryType === 'vegan' ? 'Vegan' : foodCard.dietaryType === 'pescatarian' ? 'Seafood' : 'Non-Veg'}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#192418]">
            {foodCard.name}
          </h4>
        </div>

        <Utensils className="w-4 h-4 text-[#5ba83c] shrink-0" />
      </div>

      {/* Portion Size Selector */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#7a8c79] uppercase block">
          Choose Portion:
        </label>
        <select
          value={selectedServing.label}
          onChange={(e) => {
            const found = foodCard.servings.find(s => s.label === e.target.value);
            if (found) {
              setSelectedServing(found);
              setIsLogged(false);
            }
          }}
          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-2.5 py-1.5 text-xs text-[#192418] font-semibold focus:outline-none focus:border-[#5ba83c]"
        >
          {foodCard.servings.map((s, idx) => (
            <option key={idx} value={s.label}>
              {s.label} ({s.grams}g)
            </option>
          ))}
        </select>
      </div>

      {/* Live Portion Nutrition Breakdown */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-[#f9fbf8] p-2 rounded-xl border border-[#e8ede6]">
        <div>
          <span className="block text-[8px] font-bold text-[#7a8c79]">CALORIES</span>
          <span className="font-bold text-[#192418]">{currentNutrition.calories} kcal</span>
        </div>
        <div>
          <span className="block text-[8px] font-bold text-rose-500">PROTEIN</span>
          <span className="font-bold text-rose-700">{currentNutrition.protein}g</span>
        </div>
        <div>
          <span className="block text-[8px] font-bold text-amber-500">CARBS</span>
          <span className="font-bold text-amber-700">{currentNutrition.carbs}g</span>
        </div>
        <div>
          <span className="block text-[8px] font-bold text-sky-500">FAT</span>
          <span className="font-bold text-sky-700">{currentNutrition.fat}g</span>
        </div>
      </div>

      {/* Target Meal Category & Direct Log Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#f0f4ee]">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#7a8c79] uppercase mr-1">Meal:</span>
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setSelectedMeal(m);
                setIsLogged(false);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                selectedMeal === m
                  ? 'bg-[#192418] text-white shadow-xs'
                  : 'bg-white text-[#5e6f5e] border border-[#e8ede6] hover:bg-[#edf2ea]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogFood}
          disabled={isLogged}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 ${
            isLogged
              ? 'bg-[#eef7eb] text-[#3b7e23] border border-[#d6ebd0]'
              : 'bg-[#5ba83c] hover:bg-[#4d9630] text-white'
          }`}
        >
          {isLogged ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Logged to {selectedMeal}</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to {selectedMeal}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Formats Markdown text with syntax-highlighted code blocks, headers, and bullet lists.
 */
function FormattedMessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Detect code blocks: ```language ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(
        <TextSection key={`text_${lastIndex}`} text={textBefore} />
      );
    }

    const language = match[1] || 'code';
    const code = match[2];
    parts.push(
      <CodeBlockWidget key={`code_${match.index}`} language={language} code={code} />
    );

    lastIndex = match.index + match[0].length;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText) {
    parts.push(<TextSection key={`text_${lastIndex}`} text={remainingText} />);
  }

  return <div className="space-y-2">{parts}</div>;
}

/**
 * Renders standard markdown text with headers, bold, and lists.
 */
function TextSection({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Level 3 Header (###)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-[#192418] pt-1.5 pb-0.5 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5ba83c]" />
              <span>{trimmed.replace('### ', '')}</span>
            </h3>
          );
        }

        // Level 2 Header (##)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-base font-extrabold text-[#192418] pt-2 pb-1 tracking-tight">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Bullet Point (- or * )
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[\-\•\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ba83c] mt-1.5 shrink-0" />
              <span className="text-xs sm:text-sm leading-relaxed">
                <InlineFormatter text={itemText} />
              </span>
            </div>
          );
        }

        // Numbered list (1. 2. etc)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-xs font-bold text-[#5ba83c] shrink-0 mt-0.5">
                {numMatch[1]}.
              </span>
              <span className="text-xs sm:text-sm leading-relaxed">
                <InlineFormatter text={numMatch[2]} />
              </span>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed">
            <InlineFormatter text={line} />
          </p>
        );
      })}
    </div>
  );
}

/**
 * Handles inline bold (**bold**) and inline code (`code`).
 */
function InlineFormatter({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-[#192418]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-[11px] text-[#3b7e23] font-semibold">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

/**
 * Code Block with Dark Styling and Dedicated Copy Button.
 */
function CodeBlockWidget({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#161D15] text-gray-100 my-2 shadow-sm font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#10150F] border-b border-gray-800 text-[10px] text-gray-400">
        <span className="font-bold uppercase tracking-wider text-[#8BAF78]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1 hover:text-white transition-colors p-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#8BAF78]" />
              <span className="text-[#8BAF78]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-3 overflow-x-auto text-[11px] sm:text-xs leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
