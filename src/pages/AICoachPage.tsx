import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, ShieldCheck, 
  RefreshCcw, AlertCircle, ArrowRight, Lightbulb, Trash2 
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries, getUserScopedKey, STORAGE_KEYS 
} from '../utils/storage';
import { generateCoachReply } from '../utils/aiCoachEngine';
import { ChatMessage } from '../types';

export default function AICoachPage() {
  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();
  const chatStorageKey = getUserScopedKey(STORAGE_KEYS.CHAT_HISTORY);

  const isGeminiKeyConfigured = Boolean(profile.geminiApiKey && profile.geminiApiKey.trim().length > 10);

  const initialGreeting: ChatMessage = {
    id: 'msg_welcome',
    sender: 'ai',
    text: `Hello ${profile.name}! I am your **NutriCoach AI** personal fitness & nutrition advisor.

I currently have access to your personal parameters:
• **Goal:** ${profile.goal.replace('_', ' ').toUpperCase()} (${profile.calorieTarget} kcal / ${profile.proteinTargetGrams}g Protein)
• **Today's Logged Meals:** ${todayFoods.length} items logged so far
• **Equipment:** ${profile.availableEquipment.replace('_', ' ')}
• **Diet / Budget:** ${profile.dietType} • ${profile.budget}

Ask me to review your meals today, calculate remaining protein sources, or adapt your workout routine if your time or equipment is limited.`,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, isTyping, chatStorageKey]);

  const quickPrompts = [
    'Analyze my nutrition gaps today',
    'What should I eat for dinner within my macros?',
    'I only have 30 minutes today, adapt my workout',
    'Give me budget-friendly high-protein grocery staples'
  ];

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
    setIsTyping(true);

    try {
      const reply = await generateCoachReply(
        text,
        profile,
        todayFoods,
        workoutPlan,
        progressEntries
      );

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing that query. Please try again or rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    localStorage.removeItem(chatStorageKey);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header & Connectivity Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
              AI PERFORMANCE ENGINE
            </span>
            <span className="text-xs text-zinc-500 font-mono">Context-Aware Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Fitness & Nutrition Coach
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Real-time meal critiques, macro gap analysis, workout regressions, and physiological advice.
          </p>
        </div>

        {/* Engine Connectivity Status Banner */}
        <div className="flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-4 py-2 self-start sm:self-auto">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isGeminiKeyConfigured ? 'bg-[#ccff00] shadow-[0_0_8px_#ccff00]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]'
            }`}
          />
          <div className="text-left">
            <span className="text-white font-medium text-xs block">
              {isGeminiKeyConfigured ? 'Gemini 2.5 Flash Online' : 'Local Deterministic Engine'}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block">
              {isGeminiKeyConfigured ? 'Cloud reasoning active' : 'Fast zero-latency local intelligence'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="app-card-elevated overflow-hidden shadow-2xl flex flex-col h-[640px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-transform ${
                  msg.sender === 'user'
                    ? 'bg-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.25)]'
                    : 'bg-zinc-900 border border-zinc-700/80 text-[#ccff00]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#ccff00] text-black font-medium rounded-tr-none'
                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`text-[10px] font-mono mt-2 block ${
                    msg.sender === 'user' ? 'text-black/60 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono pl-11">
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-zinc-400">Analyzing nutrition & training context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-zinc-900/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] text-zinc-400 font-mono font-semibold shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> SUGGESTED:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-zinc-900 hover:bg-[#ccff00] text-zinc-300 hover:text-black text-xs px-3 py-1 rounded-xl border border-zinc-700/70 whitespace-nowrap transition-colors font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field Bar */}
        <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about meal choices, adapting workouts, protein targets, or plateaus..."
              className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-40 text-black p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] shrink-0"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2.5 px-1 font-mono">
            <span>
              NutriCoach provides sports nutrition & fitness education.
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
