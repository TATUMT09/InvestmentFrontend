"use client";
import { useEffect, ReactNode } from "react";

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  title:    string;
  subtitle?: string;
  children: ReactNode;
  width?:   string;
}

export default function Modal({ open, onClose, title, subtitle, children, width = "max-w-lg" }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(5,10,25,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative w-full ${width} anim-scale-in rounded-2xl overflow-hidden`}
        style={{
          background: "linear-gradient(145deg, #111e38 0%, #0d1528 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "rgba(220,235,255,0.95)" }}>{title}</h2>
            {subtitle && <p className="text-sm mt-0.5" style={{ color: "rgba(120,150,200,0.55)" }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ml-4"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(150,180,230,0.6)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,0.15)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(150,180,230,0.6)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}
