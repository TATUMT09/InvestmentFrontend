"use client";
import { useState } from "react";

const MOMO_COLORS: Record<string,string> = { elektr:"#f59e0b",quvur:"#3b82f6",yol:"#64748b",gaz:"#f97316",suv:"#06b6d4",boshqa:"#8b5cf6" };
const MOMO_ICONS: Record<string,string> = { elektr:"⚡",quvur:"🔧",yol:"🛣️",gaz:"🔥",suv:"💧",boshqa:"📋" };

const MOCK_TASHKILOTLAR: { id:number; nomi:string; tur:string; xodimlar:number; faol_momo:number; bajarilgan:number; muddatOrtacha:string; viloyat:string; holat:string }[] = [];

export default function AdminTashkilotlarPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_TASHKILOTLAR.filter(t =>
    t.nomi.toLowerCase().includes(search.toLowerCase()) || t.viloyat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Tashkilotlar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Momo yo'naltiriladigan tashkilotlar ro'yxati</p>
        </div>
        <button className="text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
          + Tashkilot qo'shish
        </button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tashkilot yoki viloyat bo'yicha qidirish..."
        className="w-full max-w-sm text-sm px-4 py-2.5 rounded-xl outline-none mb-5"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.9)" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => {
          const color = MOMO_COLORS[t.tur] || "#3b82f6";
          const icon  = MOMO_ICONS[t.tur]  || "📋";
          return (
            <div key={t.id} className="p-5 rounded-2xl transition-all group"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.12)")}
              onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)")}>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color:"rgba(200,220,255,0.92)" }}>{t.nomi}</p>
                    <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>{t.viloyat}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: t.holat==="faol" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.1)",
                    color: t.holat==="faol" ? "#34d399" : "#fb7185",
                  }}>
                  {t.holat}
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label:"Xodimlar", val:t.xodimlar, color:"rgba(150,180,230,0.8)" },
                  { label:"Faol",     val:t.faol_momo, color:"#fbbf24" },
                  { label:"Bajarildi",val:t.bajarilgan, color:"#34d399" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-2.5 text-center"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-lg font-bold" style={{ color:s.color }}>{s.val}</p>
                    <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>
                  O'rtacha: <span style={{ color:"rgba(150,180,230,0.7)" }}>{t.muddatOrtacha}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-2.5 py-1 rounded-lg transition-all"
                    style={{ background:"rgba(59,130,246,0.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.2)" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.1)")}>
                    Tahrirlash
                  </button>
                  <button className="text-xs px-2.5 py-1 rounded-lg transition-all"
                    style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center" style={{ color:"rgba(100,130,200,0.4)" }}>
          <div className="text-4xl mb-3">🏢</div>
          <p className="text-sm">Hech narsa topilmadi</p>
        </div>
      )}
    </div>
  );
}
