"use client";
import { useEffect, useRef, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  color?: string;
  delay?: number;
}

function useCountUp(target: number, duration = 900, delay = 0) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(ease * target));
        if (progress < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf.current); };
  }, [target, duration, delay]);
  return count;
}

export default function StatsCard({ title, value, icon, change, changeType = "up", color = "#3b82f6", delay = 0 }: StatsCardProps) {
  const isNumeric = typeof value === "number";
  const count = useCountUp(isNumeric ? (value as number) : 0, 1000, delay * 80);
  const display = isNumeric ? count.toLocaleString("uz") : value;
  const delays = ["0s","0.06s","0.12s","0.18s","0.24s","0.30s"];

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-2xl p-5 anim-fade-up transition-all duration-300 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(255,255,255,0.065)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? `${color}35` : "rgba(255,255,255,0.07)"}`,
        animationDelay: delays[delay] || "0s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 32px ${color}18, 0 0 0 1px ${color}10` : "none",
      }}>

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all duration-300"
          style={{
            background: hovered ? `${color}28` : `${color}18`,
            border: `1px solid ${hovered ? `${color}50` : `${color}30`}`,
            boxShadow: hovered ? `0 0 16px ${color}30` : "none",
          }}>
          {icon}
        </div>
        {change && (
          <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
            style={{
              background: changeType==="up" ? "rgba(16,185,129,0.12)" : changeType==="down" ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.06)",
              color: changeType==="up" ? "#34d399" : changeType==="down" ? "#f87171" : "rgba(150,175,220,0.6)",
            }}>
            {changeType==="up" ? "↑" : changeType==="down" ? "↓" : ""} {change}
          </div>
        )}
      </div>

      <p className="text-3xl font-bold tracking-tight mb-1 transition-all duration-200"
        style={{ color: hovered ? "rgba(230,245,255,1)" : "rgba(220,235,255,0.95)" }}>
        {display}
      </p>
      <p className="text-sm" style={{ color: "rgba(120,150,200,0.6)" }}>{title}</p>

      {/* Bottom accent line */}
      <div className="mt-4 h-px rounded-full transition-all duration-300 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: hovered ? "100%" : "0%", background: `linear-gradient(90deg, ${color}80, ${color}20)` }} />
      </div>
    </div>
  );
}
