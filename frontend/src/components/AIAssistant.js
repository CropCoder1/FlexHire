import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '👋 Namaste! I\'m your FlexHire AI Assistant. I can help you with:\n\n💼 Platform guidance\n💰 Payment & ratings\n👷 Job management\n🔍 General questions\n\nKaise madad kar sakta hoon?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '⚠️ AI assistant backend is disabled. Please use the app menus or contact support for help.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '❌ Error: Unable to process request locally.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4); }
          50% { box-shadow: 0 4px 25px rgba(66, 165, 245, 0.7); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .ai-bot-button {
          animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
        }
        
        .ai-chat-window {
          animation: slideUp 0.4s ease-out;
        }
        
        .ai-message {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>

      {isOpen && (
        <div className="ai-chat-window" style={{
          width: '380px',
          height: '500px',
          backgroundColor: 'var(--color-bg_primary)',
          borderRadius: '12px',
          boxShadow: '0 5px 30px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '10px',
          border: '1px solid var(--color-border)',
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          zIndex: '9998'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--color-accent_primary)',
            color: 'white',
            padding: '15px',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: '0', fontSize: '14px', fontWeight: '700' }}>
              🤖 FlexHire AI Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.2)'
                }
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className="ai-message"
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: msg.type === 'user' 
                      ? 'var(--color-accent_primary)' 
                      : 'var(--color-bg_secondary)',
                    color: msg.type === 'user' 
                      ? 'white' 
                      : 'var(--color-text_primary)',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-message" style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  backgroundColor: 'var(--color-bg_secondary)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  ⏳ Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg_secondary)',
                color: 'var(--color-text_primary)',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-accent_primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                opacity: isLoading ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-bot-button"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent_primary)',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '9998',
          transition: 'transform 0.2s'
        }}
        title="Open AI Assistant"
      >
        🤖
      </button>
    </div>
  );
};

export default AIAssistant;

