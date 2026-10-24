import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, ShieldCheck, 
  RefreshCcw, AlertCircle, ArrowRight, Lightbulb 
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries 
} from '../utils/storage';
import { generateCoachReply } from '../utils/aiCoachEngine';
import { ChatMessage } from '../types';

export default function AICoachPage() {
  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();

  const isGeminiKeyConfigured = Boolean(profile.geminiApiKey && profile.geminiApiKey.trim().length > 10);

  const initialGreeting: ChatMessage = {
    id: 'msg_welcome',
    sender: 'ai',
    text: `Hello ${profile.name}! I am your **NutriCoach AI** personal fitness & nutrition advisor.

I currently have access to your personal stats:
- **Goal:** ${profile.goal.replace('_', ' ').toUpperCase()} (${profile.calorieTarget} kcal / ${profile.proteinTargetGrams}g Protein)
- **Today's Logged Meals:** ${todayFoods.length} items logged so far
- **Equipment:** ${profile.availableEquipment.replace('_', ' ')}
- **Diet / Budget:** ${profile.dietType} • ${profile.budget}

Ask me to review your meals today, calculate remaining protein sources, or adapt your workout routine if your time or equipment is limited.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nutricoach_chat_history_v1');
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
      localStorage.setItem('nutricoach_chat_history_v1', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const quickPrompts = [
    'Analyze my nutrition gaps today',
    'What should I eat for dinner within my macros?',
    'I only have 30 minutes today, adapt my workout',
    'Give me cheap high-protein grocery staples'
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
    localStorage.removeItem('nutricoach_chat_history_v1');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Connectivity Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#ccff00]/15 text-[#ccff00] px-2.5 py-0.5 rounded border border-[#ccff00]/40">
              AI FITNESS & NUTRITION COACH
            </span>
          </div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">
            INTELLIGENT PERFORMANCE CHAT
          </h1>
        </div>

        {/* Engine Connectivity Status Banner */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isGeminiKeyConfigured ? 'bg-[#ccff00] animate-pulse' : 'bg-blue-400'
            }`}
          />
          <span className="text-zinc-300 font-mono text-[11px]">
            {isGeminiKeyConfigured ? (
              <strong className="text-[#ccff00]">Gemini Live API Connected</strong>
            ) : (
              <span>Local Intelligence Mode (No API key needed)</span>
            )}
          </span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                    : 'bg-zinc-800 border border-zinc-700 text-[#ccff00]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#ccff00] text-black font-medium'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`text-[9px] font-mono mt-1.5 block ${
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
              <span className="ml-2">Analyzing nutrition & training context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-900/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] text-zinc-500 font-mono font-bold shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-yellow-400" /> SUGGESTED:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-zinc-800 hover:bg-[#ccff00] text-zinc-300 hover:text-black text-[11px] px-2.5 py-1 rounded-lg border border-zinc-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field Bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
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
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] shrink-0"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 px-1">
            <span>
              NutriCoach provides sports nutrition & fitness education. Consult a physician for medical conditions.
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="hover:text-zinc-300 transition-colors"
            >
              Clear chat history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
