"use client";
import { useState } from "react";
import { MOMO_TURI_LABELS, MOMO_TURI_ICONS } from "@/lib/constants";
import { MomoTuri } from "@/types/momo.types";

const TURLAR = Object.keys(MOMO_TURI_LABELS) as MomoTuri[];
const turiColor: Record<string,string> = { elektr:"#f59e0b",quvur:"#3b82f6",yol:"#64748b",gaz:"#f97316",suv:"#06b6d4",boshqa:"#8b5cf6" };

export default function VaqtBelgilashPage() {
  const [vaqtlar, setVaqtlar] = useState<Record<string,number>>({});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Vaqt belgilash</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Har bir momo turi uchun hal qilish muddatini belgilang</p>
      </div>

      <div className="max-w-lg space-y-3">
        {TURLAR.map(tur => {
          const color = turiColor[tur] || "#3b82f6";
          return (
            <div key={tur} className="flex items-center justify-between gap-4 p-4 rounded-2xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
                  {MOMO_TURI_ICONS[tur]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color:"rgba(200,220,255,0.88)" }}>{MOMO_TURI_LABELS[tur]}</p>
                  <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>Muddat (kun)</p>
                </div>
              </div>
              <input type="number" min={1} max={30} value={vaqtlar[tur]||""} placeholder="5"
                onChange={e=>setVaqtlar(p=>({...p,[tur]:Number(e.target.value)}))}
                className="w-20 text-center text-sm font-bold rounded-xl px-3 py-2.5 outline-none transition-all"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,220,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor=color; e.target.style.boxShadow=`0 0 0 3px ${color}15`;}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none";}}
              />
            </div>
          );
        })}

        <button className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all mt-2"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
          Saqlash
        </button>
      </div>
    </div>
  );
}
