import { Momo } from "@/types/momo.types";
import { MOMO_TURI_ICONS, MOMO_TURI_LABELS } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";

const turiColor: Record<string,string> = {
  elektr:"#f59e0b", quvur:"#3b82f6", yol:"#64748b", gaz:"#f97316", suv:"#06b6d4", boshqa:"#8b5cf6",
};

export default function MomoCard({ momo, href }: { momo:Momo; href?:string }) {
  const color = turiColor[momo.turi] || "#3b82f6";
  const content = (
    <div className="rounded-2xl p-4 cursor-pointer transition-all"
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.transform="translateY(0)";}}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
            {MOMO_TURI_ICONS[momo.turi]}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color:"rgba(210,225,255,0.9)" }}>{MOMO_TURI_LABELS[momo.turi]} momosi</p>
            <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.55)" }}>📍 {truncate(momo.lokatsiya.manzil,30)}</p>
          </div>
        </div>
        <StatusBadge status={momo.status} />
      </div>
      {momo.tavsif && (
        <p className="text-sm leading-relaxed mb-3" style={{ color:"rgba(150,175,220,0.6)" }}>{truncate(momo.tavsif,90)}</p>
      )}
      <div className="flex items-center justify-between pt-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>{formatDate(momo.yaratilgan)}</span>
        {momo.muddati && (
          <span className="text-xs font-medium" style={{ color:"#fbbf24" }}>⏰ {formatDate(momo.muddati)}</span>
        )}
      </div>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
