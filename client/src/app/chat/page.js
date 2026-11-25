'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAirData } from '../../context/AirDataContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Bot,
  User,
  Send,
  Sparkles,
  MapPin,
  ShieldAlert,
  Home,
  CheckCircle2,
  Leaf,
  Heart,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function ChatPage() {
  const { airData, selectedCity } = useAirData();
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your AirAware Environmental Assistant. I am monitoring live air quality in ${
        airData?.city || selectedCity
      } where AQI is currently ${airData?.aqi || 180} (${
        airData?.severity || 'Unhealthy'
      }). How can I help protect your health or reduce your emissions today?`,
      structuredData: null,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Is it safe to go outside today?',
    'What should my family do during severe smog?',
    'How can I improve indoor air quality on a budget?',
    'What is the safest time to exercise outdoors?',
    'What precautions should children and elderly people take?',
    'How can I reduce my daily carbon footprint?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText = input) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    setInput('');
    const userMsg = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const payload = {
        query: textToSend,
        city: airData?.city || selectedCity,
        lat: airData?.coordinates?.lat,
        lon: airData?.coordinates?.lon,
        sessionId: user?.id || 'guest-session',
        chatHistory: messages.slice(-4),
      };

      const res = await api.post('/ai/chat', payload);

      if (res.data.success && res.data.response) {
        const assistantMsg = {
          role: 'assistant',
          content: res.data.response.airQualitySummary || 'Here is your personalized environmental guidance.',
          structuredData: res.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.warn('Chat error:', err);
      const errorMsg = {
        role: 'assistant',
        content:
          'I encountered an issue connecting to the AI model. Based on your current AQI, please keep windows sealed and run indoor HEPA filtration.',
        structuredData: null,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Context Top Bar */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">AirAware AI Assistant</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>
                {airData?.city || selectedCity} • AQI {airData?.aqi || 'N/A'} ({airData?.severity || 'Active'}) • Temp{' '}
                {airData?.weather?.temperature || '20'}°C
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: 'assistant',
                content: `Chat session refreshed. Current AQI in ${airData?.city || selectedCity} is ${
                  airData?.aqi || 180
                }. Ask any environmental or health question!`,
                structuredData: null,
                timestamp: new Date(),
              },
            ])
          }
          title="Reset Chat"
          aria-label="Reset chat history"
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
        className="flex-1 overflow-y-auto space-y-4 pr-1"
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const struct = msg.structuredData;

          return (
            <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Main bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                {/* Structured Rich Output (when returned by AI) */}
                {struct && (
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4 text-xs">
                    {/* Pollution Status Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                        AI Assessment & Guidance
                      </span>
                      {struct.pollutionLevel && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                          {struct.pollutionLevel}
                        </span>
                      )}
                    </div>

                    {/* Recommended Actions (WHAT, WHY, HOW) */}
                    {struct.recommendedActions && struct.recommendedActions.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Recommended Actions</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {struct.recommendedActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Indoor Safety Tips */}
                    {struct.indoorSafetyTips && struct.indoorSafetyTips.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Home className="w-3.5 h-3.5 text-sky-600" />
                          <span>Indoor Air Quality Strategies</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {struct.indoorSafetyTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Low Emission Alternatives */}
                    {struct.lowEmissionAlternatives && struct.lowEmissionAlternatives.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Leaf className="w-3.5 h-3.5 text-teal-600" />
                          <span>Low-Emission Alternatives</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {struct.lowEmissionAlternatives.map((alt, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                              <span>{alt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Health Precautions & Vulnerability Notice */}
                    {struct.healthPrecautions && (
                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Health & Vulnerable Group Precautions</span>
                        </div>
                        <p className="leading-relaxed">{struct.healthPrecautions}</p>
                      </div>
                    )}

                    {/* Estimated Impact */}
                    {struct.estimatedImpact && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Estimated Environmental & Health Impact</span>
                        </div>
                        <p className="leading-relaxed">{struct.estimatedImpact}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div role="status" aria-live="polite" className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" aria-hidden="true" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" aria-hidden="true"></span>
              <span>Analyzing live AQI and synthesizing personalized guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0">Suggestions:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors shrink-0 shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Ask an environmental question</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g., Can I take my kids to the park today?)..."
          className="flex-1 px-4 py-3 bg-white rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send question"
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-colors disabled:opacity-50 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden"
        >
          <span>Send</span>
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
