import { MomoStatus } from "@/types/momo.types";
import { MOMO_STATUS_LABELS } from "@/lib/constants";

const cfg: Record<MomoStatus, { bg: string; color: string; dot: string }> = {
  yuborildi:         { bg: "rgba(148,163,184,0.1)", color: "rgba(148,163,184,0.85)", dot: "#94a3b8" },
  korib_chiqilmoqda: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24",               dot: "#f59e0b" },
  bajarilmoqda:      { bg: "rgba(59,130,246,0.12)",  color: "#60a5fa",              dot: "#3b82f6" },
  bajarildi:         { bg: "rgba(16,185,129,0.12)",  color: "#34d399",              dot: "#10b981" },
};

export default function StatusBadge({ status, className }: { status: MomoStatus; className?: string }) {
  const c = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className || ""}`}
      style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot, boxShadow: `0 0 4px ${c.dot}` }} />
      {MOMO_STATUS_LABELS[status]}
    </span>
  );
}
