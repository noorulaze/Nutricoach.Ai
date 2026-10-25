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
    text: `Hello ${profile.name}! I am your **NutriCoach AI** personal fitness & nutrition advisor 🌱

I currently have access to your personal parameters:
• **Goal:** ${profile.goal.replace('_', ' ').toUpperCase()} (${profile.calorieTarget} kcal / ${profile.proteinTargetGrams}g Protein)
• **Today's Logged Meals:** ${todayFoods.length} items logged so far
• **Regional Cuisine:** Full support for Kerala cuisine (പുട്ട്, കടല, മീൻ, കപ്പ), Indian regional dishes, & global foods
• **Equipment:** ${profile.availableEquipment.replace('_', ' ')}
• **Diet / Budget:** ${profile.dietType} • ${profile.budget}

Ask me to review your meals today, fit traditional Kerala dishes into your macros, suggest high-protein alternatives, or adapt your workout routine.`,
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
    'How do I fit Puttu and Kadala curry into my macros?',
    'What Kerala foods will give me 30g protein?',
    'Analyze my nutrition gaps today',
    'Suggest a low-calorie traditional Kerala dinner',
    'I only have 30 minutes today, adapt my workout'
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Connectivity Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
              AI PERFORMANCE ENGINE
            </span>
            <span className="text-xs text-[#7a8c79] font-medium">Context-Aware Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
            AI Fitness & Nutrition Coach
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
            Real-time meal critiques, macro gap analysis, workout regressions, and physiological advice.
          </p>
        </div>

        {/* Engine Connectivity Status Banner */}
        <div className="flex items-center gap-2.5 bg-white border border-[#e8ede6] rounded-2xl px-4 py-2 self-start sm:self-auto shadow-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isGeminiKeyConfigured ? 'bg-[#5ba83c] shadow-xs' : 'bg-sky-500'
            }`}
          />
          <div className="text-left">
            <span className="text-[#192418] font-bold text-xs block">
              {isGeminiKeyConfigured ? 'Gemini 2.5 Flash Online' : 'Local Deterministic Engine'}
            </span>
            <span className="text-[10px] text-[#7a8c79] font-medium block">
              {isGeminiKeyConfigured ? 'Cloud reasoning active' : 'Zero-latency local intelligence'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white border border-[#e8ede6] rounded-3xl overflow-hidden shadow-sm flex flex-col h-[640px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fcfdfc]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold transition-transform shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#5ba83c] text-white'
                    : 'bg-[#eef7eb] border border-[#d6ebd0] text-[#3b7e23]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#5ba83c] text-white font-medium rounded-tr-none'
                    : 'bg-[#f6f8f5] border border-[#e8ede6] text-[#192418] rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`text-[10px] font-medium mt-2 block ${
                    msg.sender === 'user' ? 'text-white/70 text-right' : 'text-[#8e9f8e]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#5e6f5e] font-medium pl-11">
              <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#5ba83c] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-[#7a8c79]">Analyzing nutrition & training context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2.5 border-t border-[#e8ede6] bg-[#f9fbf8] overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] text-[#7a8c79] font-bold uppercase shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> SUGGESTED:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-[#eef7eb] hover:text-[#3b7e23] text-[#5e6f5e] text-xs px-3 py-1 rounded-xl border border-[#e8ede6] whitespace-nowrap transition-colors font-medium shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field Bar */}
        <div className="p-4 bg-white border-t border-[#e8ede6]">
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
              className="flex-1 bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#5ba83c] hover:bg-[#4d9630] disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-xs shrink-0"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4 fill-white" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#7a8c79] mt-2.5 px-1 font-medium">
            <span>
              NutriCoach provides sports nutrition & fitness education.
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[#7a8c79] hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
