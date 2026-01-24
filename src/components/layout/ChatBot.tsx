"use client";

import { useState } from "react";
import { css } from "../../../styled-system/css";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help answer questions about LACTIVAE™. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question. For detailed information about LACTIVAE™ (raw milk, oral solution), please consult our clinical studies page or speak with a healthcare provider.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={css({
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 60,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          bg: "accent.secondary",
          color: "bg.primary",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-out",
          _hover: {
            transform: "translateY(-50%) scale(1.05)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        })}
        aria-label="Chat Assistant"
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className={css({
              position: "fixed",
              inset: 0,
              bg: "rgba(0, 0, 0, 0.3)",
              zIndex: 59,
              display: { base: "block", md: "none" },
            })}
          />

          {/* Chat Window */}
          <div
            className={css({
              position: "fixed",
              right: { base: "0", md: "20px" },
              top: { base: "0", md: "0" },
              bottom: { base: "0", md: "0" },
              transform: { base: "none", md: "none" },
              zIndex: 60,
              bg: "bg.primary",
              borderRadius: { base: "0", md: "12px" },
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: { base: "100%", md: "400px" },
              height: { base: "100vh", md: "calc(100vh - 40px)" },
              margin: { base: "0", md: "20px 0" },
              border: "1px solid",
              borderColor: "border.medium",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {/* Chat Header */}
            <div
              className={css({
                padding: "1.5rem",
                borderBottom: "1px solid",
                borderColor: "border.light",
                bg: "bg.tertiary",
                borderRadius: { base: "0", md: "12px 12px 0 0" },
              })}
            >
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <div>
                  <h3
                    className={css({
                      fontFamily: "body",
                      fontSize: "lg",
                      fontWeight: "600",
                      color: "accent.primary",
                    })}
                  >
                    LACTIVAE™ Assistant
                  </h3>
                  <p
                    className={css({
                      fontFamily: "body",
                      fontSize: "xs",
                      color: "text.muted",
                      marginTop: "0.25rem",
                    })}
                  >
                    Ask about our product
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={css({
                    bg: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "text.muted",
                    padding: "0.25rem",
                    _hover: {
                      color: "text.primary",
                    },
                  })}
                  aria-label="Close chat"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div
              className={css({
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              })}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={css({
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  })}
                >
                  <div
                    className={css({
                      maxWidth: "75%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      bg: message.sender === "user" ? "accent.primary" : "bg.secondary",
                      color: message.sender === "user" ? "bg.primary" : "text.primary",
                      fontFamily: "body",
                      fontSize: "sm",
                      lineHeight: "1.5",
                    })}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div
              className={css({
                padding: "1rem 1.5rem",
                borderTop: "1px solid",
                borderColor: "border.light",
                bg: "bg.secondary",
                borderRadius: { base: "0", md: "0 0 12px 12px" },
              })}
            >
              <div
                className={css({
                  display: "flex",
                  gap: "0.5rem",
                })}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className={css({
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "border.medium",
                    bg: "bg.primary",
                    color: "text.primary",
                    fontFamily: "body",
                    fontSize: "sm",
                    outline: "none",
                    _focus: {
                      borderColor: "accent.primary",
                    },
                  })}
                />
                <button
                  onClick={handleSendMessage}
                  className={css({
                    padding: "0.75rem 1.25rem",
                    borderRadius: "8px",
                    bg: "accent.primary",
                    color: "bg.primary",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "body",
                    fontSize: "sm",
                    fontWeight: "600",
                    transition: "all 0.2s ease-out",
                    _hover: {
                      bg: "accent.secondary",
                    },
                    _disabled: {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  })}
                  disabled={!inputValue.trim()}
                >
                  Send
                </button>
              </div>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "xs",
                  color: "text.muted",
                  marginTop: "0.75rem",
                  textAlign: "center",
                })}
              >
                This is a demo chatbot. For medical advice, consult your healthcare provider.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
