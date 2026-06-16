import { MomoTuri } from "@/types/momo.types";
import { MOMO_TURI_ICONS, MOMO_TURI_LABELS } from "@/lib/constants";

const turiColor: Record<string, string> = {
  elektr:"#f59e0b", quvur:"#3b82f6", yol:"#64748b", gaz:"#f97316", suv:"#06b6d4", boshqa:"#8b5cf6",
};

export default function AiResultCard({ turi, tahlil, ishonch }: { turi:MomoTuri; tahlil:string; ishonch?:number }) {
  const color = turiColor[turi] || "#3b82f6";
  return (
    <div className="relative overflow-hidden rounded-2xl p-5"
      style={{ background:"#0d1528", border:"1px solid rgba(255,255,255,0.08)" }}>
      <div className="absolute inset-0" style={{
        backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)",
        backgroundSize:"20px 20px"
      }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)" }}>🤖</div>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color:"rgba(124,58,237,0.7)" }}>AI Tahlili</span>
          {ishonch !== undefined && (
            <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background:"rgba(124,58,237,0.15)", color:"#a78bfa" }}>{ishonch}% aniqlik</span>
          )}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background:`${color}18`, border:`1px solid ${color}30`, boxShadow:`0 0 20px ${color}20` }}>
            {MOMO_TURI_ICONS[turi]}
          </div>
          <div>
            <p className="font-bold text-lg" style={{ color:"rgba(220,235,255,0.95)" }}>{MOMO_TURI_LABELS[turi]} momosi</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#10b981" }} />
              <p className="text-xs font-semibold" style={{ color:"#34d399" }}>Tegishli tashkilotga yuborildi</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(170,195,255,0.7)" }}>{tahlil}</p>
        </div>
      </div>
    </div>
  );
}
