import { useState } from 'react';
import axios from 'axios';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your Workspace AI Copilot. I have live access to your goals, habits, and timesheet. How can I help you plan today?"
    }
  ]);

  const quickPrompts = [
    'Give me a workspace summary',
    'What should I focus on next?',
    'Break down my top goal',
    'Check my habit streaks'
  ];

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const updatedMessages = [...messages, { role: 'user', text: query }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        message: query
      });
      setMessages([
        ...updatedMessages,
        { role: 'ai', text: response.data.reply }
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages([
        ...updatedMessages,
        { role: 'ai', text: 'Sorry, I could not connect to the backend AI service. Please try again in a moment.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all font-medium text-sm whitespace-nowrap"
      >
        <Sparkles size={17} />
        <span>Ask AI</span>
      </button>

      {/* Slide-Over Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-xl border border-sky-100 flex flex-col overflow-hidden h-[520px]">

          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles size={17} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Workspace AI Copilot</h3>
                <p className="text-[11px] text-sky-100">Connected to live workspace data</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-sky-50/40 to-indigo-50/30 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'ai'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  {msg.role === 'ai' ? <Bot size={15} /> : <User size={15} />}
                </div>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line max-w-[80%] ${
                    msg.role === 'ai'
                      ? 'bg-white text-slate-800 border border-sky-100 rounded-tl-none'
                      : 'bg-sky-600 text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-sky-600 pl-9">
                <span>Analyzing your workspace...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-sky-100 flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="shrink-0 text-[11px] bg-sky-50 hover:bg-sky-100 text-sky-700 px-2.5 py-1 rounded-lg transition-colors border border-sky-100 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-sky-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about your goals, habits, or schedule..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs bg-sky-50/50 border border-sky-100 rounded-lg px-3 py-2.5 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-sky-600 text-white p-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-40 transition-colors"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AIAssistant;