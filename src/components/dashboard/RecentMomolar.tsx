"use client";
import { Momo, MomoStatus } from "@/types/momo.types";
import StatusBadge from "@/components/shared/StatusBadge";

// Fallback mock data to always show something
const DEMO: Array<{ id:string; icon:string; color:string; tur:string; manzil:string; holat:MomoStatus; sana:string }> = [
  { id:"M-1042", icon:"⚡", color:"#f59e0b", tur:"Elektr",  manzil:"Yunusobod, 7-uy",    holat:"korib_chiqilmoqda", sana:"07.04 · 09:14" },
  { id:"M-1039", icon:"💧", color:"#06b6d4", tur:"Suv",     manzil:"Chilonzor, 3-mavze",  holat:"bajarilmoqda",      sana:"06.04 · 18:32" },
  { id:"M-1035", icon:"🔥", color:"#f97316", tur:"Gaz",     manzil:"Mirzo Ulug'bek",      holat:"yuborildi",         sana:"05.04 · 11:07" },
  { id:"M-1029", icon:"🛣️", color:"#64748b", tur:"Yo'l",    manzil:"Uchtepa tumani",      holat:"bajarildi",         sana:"03.04 · 14:55" },
  { id:"M-1021", icon:"🔧", color:"#3b82f6", tur:"Quvur",   manzil:"Sergeli, 14-kvartal", holat:"bajarildi",         sana:"01.04 · 08:20" },
];

export default function RecentMomolar({ momolar }: { momolar: Momo[] }) {
  const showDemo = momolar.length === 0;

  return (
    <div className="rounded-2xl overflow-hidden anim-fade-up anim-delay-4"
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <p className="font-semibold text-sm" style={{ color:"rgba(210,225,255,0.9)" }}>So'nggi momolar</p>
          <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>Eng yangi {showDemo ? "namuna" : ""} muammolar</p>
        </div>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
          style={{ color:"#60a5fa", background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.15)" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.16)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.08)")}>
          Barchasini ko'rish →
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-2.5"
        style={{ background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {["Momo","Holat","Sana"].map((h, i) => (
          <p key={h} className={`text-[10px] font-bold tracking-widest uppercase ${i===2?"col-span-3 text-right":i===1?"col-span-2":"col-span-7"}`}
            style={{ color:"rgba(100,130,200,0.4)" }}>{h}</p>
        ))}
      </div>

      {/* Rows */}
      {showDemo
        ? DEMO.map((m, i) => (
          <div key={m.id}
            className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 transition-all duration-150 cursor-pointer group anim-fade-up"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", animationDelay:`${i*0.06+0.2}s` }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.035)"; e.currentTarget.style.paddingLeft="24px"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.paddingLeft="20px"; }}>
            <div className="col-span-7 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 transition-transform duration-150 group-hover:scale-110"
                style={{ background:`${m.color}18`, border:`1px solid ${m.color}28` }}>
                {m.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color:"rgba(200,220,255,0.88)" }}>{m.tur}</p>
                  <span className="text-[10px] font-mono shrink-0" style={{ color:"rgba(100,130,200,0.4)" }}>{m.id}</span>
                </div>
                <p className="text-xs truncate" style={{ color:"rgba(100,130,200,0.5)" }}>📍 {m.manzil}</p>
              </div>
            </div>
            <div className="col-span-2"><StatusBadge status={m.holat} /></div>
            <p className="col-span-3 text-xs text-right" style={{ color:"rgba(100,130,200,0.5)" }}>{m.sana}</p>
          </div>
        ))
        : momolar.map((m, i) => (
          <div key={m.id}
            className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 cursor-pointer transition-all duration-150 group anim-fade-up"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", animationDelay:`${i*0.06}s` }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.035)"; e.currentTarget.style.paddingLeft="24px"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.paddingLeft="20px"; }}>
            <div className="col-span-7 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform duration-150"
                style={{ background:"rgba(255,255,255,0.06)" }}>
                📋
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color:"rgba(200,220,255,0.88)" }}>{m.id}</p>
                <p className="text-xs truncate" style={{ color:"rgba(100,130,200,0.5)" }}>{m.lokatsiya?.manzil}</p>
              </div>
            </div>
            <div className="col-span-2"><StatusBadge status={m.status} /></div>
            <p className="col-span-3 text-xs text-right" style={{ color:"rgba(100,130,200,0.5)" }}>{String(m.yaratilgan)}</p>
          </div>
        ))
      }
    </div>
  );
}
