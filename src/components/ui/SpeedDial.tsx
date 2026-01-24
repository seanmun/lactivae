"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import ChatWidget from "./ChatWidget";

export default function SpeedDial() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const router = useRouter();

  const handleAccessibility = () => {
    const newSize = fontSize === "normal" ? "large" : "normal";
    setFontSize(newSize);
    document.documentElement.style.fontSize = newSize === "large" ? "120%" : "100%";
    setIsOpen(false);
  };

  const handleChat = () => {
    setIsChatOpen(true);
    setIsOpen(false);
  };

  const handleSubscribe = () => {
    router.push("/register");
    setIsOpen(false);
  };

  const actions = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM21 9h-6V7h-2v2H7V7H5v2H3c-.55 0-1 .45-1 1s.45 1 1 1h2v6c0 1.1.9 2 2 2h2v4h2v-4h2v4h2v-4h2c1.1 0 2-.9 2-2v-6h2c.55 0 1-.45 1-1s-.45-1-1-1z"/>
        </svg>
      ),
      label: "Accessibility",
      onClick: handleAccessibility,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: "Chat",
      onClick: handleChat,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 7 10-7" />
        </svg>
      ),
      label: "Subscribe",
      onClick: handleSubscribe,
    },
  ];

  return (
    <div
      className={css({
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "1rem",
      })}
    >
      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={css({
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "50%",
          bg: "accent.primary",
          border: "2px solid",
          borderColor: "accent.secondary",
          color: "bg.primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease-out",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          _hover: {
            transform: "scale(1.1) rotate(90deg)",
            bg: "accent.secondary",
          },
        })}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={css({
            transition: "transform 0.3s ease-out",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          })}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Action Buttons */}
      {isOpen &&
        actions.map((action, index) => (
          <div
            key={index}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animation: "slideInFromRight 0.2s ease-out",
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "backwards",
            })}
          >
            {/* Label */}
            <span
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                padding: "0.5rem 1rem",
                bg: "rgba(255, 255, 255, 0.95)",
                color: "accent.primary",
                borderRadius: "6px",
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: "border.light",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              })}
            >
              {action.label}
            </span>

            {/* Action Button */}
            <button
              onClick={action.onClick}
              className={css({
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                bg: "rgba(255, 255, 255, 0.95)",
                border: "1px solid",
                borderColor: "border.light",
                color: "accent.primary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease-out",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                _hover: {
                  transform: "scale(1.1)",
                  bg: "accent.primary",
                  color: "bg.primary",
                },
              })}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          </div>
        ))}

      {/* Keyframes for animation */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
