"use client";
import { useState, useEffect } from "react";
import { getProblems } from "@/services/problemService";
import { useAuthStore } from "@/store/authStore";
import type { Problem } from "@/types/api.types";

function startOf(unit: "day" | "week" | "month"): Date {
  const d = new Date();
  if (unit === "day")  { d.setHours(0,0,0,0); return d; }
  if (unit === "week") { const day = d.getDay(); d.setDate(d.getDate() - (day===0?6:day-1)); d.setHours(0,0,0,0); return d; }
  d.setDate(1); d.setHours(0,0,0,0); return d;
}

function periodStats(problems: Problem[], from: Date) {
  const inPeriod = problems.filter(p => p.createdAt && new Date(p.createdAt) >= from);
  const jami       = inPeriod.length;
  const bajarildi  = inPeriod.filter(p => p.status === "HAL_ETILDI").length;
  const qoldi      = jami - bajarildi;
  return { jami, bajarildi, qoldi };
}

const PERIOD_CFG = [
  { key:"kunlik",   label:"Kunlik",   icon:"📅", period:"Bugun",    color:"#60a5fa", fn: ()=>startOf("day")   },
  { key:"haftalik", label:"Haftalik", icon:"📅", period:"Bu hafta", color:"#a78bfa", fn: ()=>startOf("week")  },
  { key:"oylik",    label:"Oylik",    icon:"📅", period:"Bu oy",    color:"#34d399", fn: ()=>startOf("month") },
];

export default function TashkilotStatistikaPage() {
  const { user }  = useAuthStore();
  const orgType   = user?.organizationType ?? "";

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProblems()
      .then(all => setProblems(orgType ? all.filter(p => p.type === orgType) : all))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, [orgType]);

  const total      = problems.length;
  const halEtildi  = problems.filter(p => p.status === "HAL_ETILDI").length;
  const korib      = problems.filter(p => p.status === "KORIB_CHIQILMOQDA").length;
  const yangi      = problems.filter(p => p.status === "YANGI").length;
  const pct        = total > 0 ? Math.round((halEtildi / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Statistika</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Tashkilot faoliyati ko'rsatkichlari</p>
      </div>

      {/* ── Kunlik / Haftalik / Oylik ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PERIOD_CFG.map(cfg => {
          const s = periodStats(problems, cfg.fn());
          return (
            <div key={cfg.key} className="p-5 rounded-2xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background:`${cfg.color}15`, border:`1px solid ${cfg.color}30` }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color:"rgba(200,220,255,0.9)" }}>{cfg.label}</p>
                    <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{cfg.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: cfg.color }}>
                    {loading ? "..." : `${s.jami > 0 ? Math.round((s.bajarildi/s.jami)*100) : 0}%`}
                  </p>
                  <p className="text-[10px]" style={{ color:"rgba(100,130,200,0.5)" }}>bajarildi</p>
                </div>
              </div>

              <div className="h-1.5 rounded-full mb-4" style={{ background:"rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: loading ? "0%" : `${s.jami > 0 ? (s.bajarildi/s.jami)*100 : 0}%`,
                    background: cfg.color,
                    boxShadow: `0 0 8px ${cfg.color}60`,
                  }} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label:"Jami",      val: s.jami,      color:"rgba(150,180,230,0.8)" },
                  { label:"Bajarildi", val: s.bajarildi, color:"#34d399" },
                  { label:"Qoldi",     val: s.qoldi,     color:"#f87171" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-2.5 text-center"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-xl font-bold" style={{ color: stat.color }}>
                      {loading ? "..." : stat.val}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami muammolar",      val: loading ? "..." : String(total),    color:"#60a5fa" },
          { label:"Hal qilingan (%)",     val: loading ? "..." : `${pct}%`,        color:"#34d399" },
          { label:"Ko'rib chiqilmoqda",   val: loading ? "..." : String(korib),    color:"#fbbf24" },
          { label:"Yangi (kutilmoqda)",   val: loading ? "..." : String(yangi),    color:"#f87171" },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-1 h-6 rounded-full mx-auto mb-2" style={{ background: k.color, boxShadow:`0 0 8px ${k.color}` }} />
            <p className="text-2xl font-bold" style={{ color:k.color }}>{k.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.55)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* ── Status taqsimot ── */}
      <div className="rounded-2xl p-5"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm font-bold mb-4" style={{ color:"rgba(210,225,255,0.9)" }}>Umumiy holat</p>
        <div className="space-y-3">
          {[
            { label:"Yangi",             count: yangi,     color:"#64748b", total },
            { label:"Ko'rib chiqilmoqda",count: korib,     color:"#f59e0b", total },
            { label:"Hal etildi",        count: halEtildi, color:"#10b981", total },
          ].map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs font-medium" style={{ color:"rgba(150,180,230,0.8)" }}>{s.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: s.color }}>
                  {loading ? "..." : s.count} ta
                  {!loading && s.total > 0 && (
                    <span style={{ color:"rgba(100,130,200,0.5)", fontWeight:400 }}>
                      {" "}({Math.round((s.count/s.total)*100)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background:"rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: loading ? "0%" : `${s.total > 0 ? (s.count/s.total)*100 : 0}%`,
                    background: s.color,
                  }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
