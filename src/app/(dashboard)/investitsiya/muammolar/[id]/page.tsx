"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProblem, updateProblem } from "@/services/problemService";
import { getFilesByProblem } from "@/services/fileService";
import type { Problem, FileItem } from "@/types/api.types";

const GOLD = "#c9a84c";

const STATUS_CFG: Record<string, { label: string; color: string; glow: string }> = {
  YANGI:      { label: "Yangi",      color: "#38bdf8", glow: "rgba(56,189,248,0.3)"  },
  JARAYONDA:  { label: "Jarayonda",  color: "#f59e0b", glow: "rgba(245,158,11,0.3)"  },
  HAL_ETILDI: { label: "Hal etildi", color: "#34d399", glow: "rgba(52,211,153,0.3)"  },
};
const sCfg = (s: string) => STATUS_CFG[s] ?? { label: s, color: "#94a3b8", glow: "rgba(148,163,184,0.2)" };

const TYPE_ICONS:  Record<string, string> = { ELEKTR:"⚡", SUV:"💧", GAZ:"🔥", YOL:"🛣️", HUJJAT:"📄", MOLIYA:"💰", INTERNET:"🌐", BOSHQA:"📋" };
const TYPE_COLORS: Record<string, string> = { ELEKTR:"#fbbf24", SUV:"#38bdf8", GAZ:"#f87171", YOL:"#a78bfa", HUJJAT:"#94a3b8", MOLIYA:"#34d399", INTERNET:"#60a5fa", BOSHQA:"#94a3b8" };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const STEPS = [
  { key:"YANGI",      label:"Yuborildi",          icon:"📨", order: 0 },
  { key:"JARAYONDA",  label:"Ko'rib chiqilmoqda", icon:"🔍", order: 1 },
  { key:"HAL_ETILDI", label:"Hal etildi",         icon:"✅", order: 2 },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background:"rgba(255,255,255,0.032)", border:"1px solid rgba(255,255,255,0.085)", backdropFilter:"blur(10px)" }}>
      {children}
    </div>
  );
}
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
      style={{ color:"rgba(100,130,200,0.45)" }}>
      {children}
    </p>
  );
}

export default function MuammoDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [problem,   setProblem]   = useState<Problem | null>(null);
  const [files,     setFiles]     = useState<FileItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [updating,  setUpdating]  = useState(false);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const pid = Number(id);
    Promise.all([getProblem(pid), getFilesByProblem(pid)])
      .then(([p, f]) => { setProblem(p); setFiles(f); })
      .catch(() => setProblem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdvance = async () => {
    if (!problem) return;
    const next = problem.status === "YANGI" ? "JARAYONDA" : problem.status === "JARAYONDA" ? "HAL_ETILDI" : null;
    if (!next) return;
    setUpdating(true);
    try {
      await updateProblem(problem.id, { status: next });
      setProblem(prev => prev ? { ...prev, status: next } : prev);
    } catch { /**/ }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="text-5xl animate-pulse">⚠️</div>
        <p className="text-sm" style={{ color:"rgba(100,130,200,0.5)" }}>Yuklanmoqda...</p>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="text-5xl">❌</div>
        <p className="font-semibold" style={{ color:"rgba(150,180,230,0.7)" }}>Muammo topilmadi</p>
        <button onClick={() => router.back()}
          className="text-sm px-5 py-2.5 rounded-xl font-semibold"
          style={{ background:`${GOLD}18`, color:GOLD, border:`1px solid ${GOLD}35` }}>
          ← Orqaga
        </button>
      </div>
    </div>
  );

  const sc        = sCfg(problem.status);
  const tcolor    = TYPE_COLORS[problem.type] ?? "#94a3b8";
  const typeIcon  = TYPE_ICONS[problem.type]  ?? "⚠️";
  const nextLabel = problem.status === "YANGI" ? "Jarayonda deb belgilash"
                  : problem.status === "JARAYONDA" ? "Hal etildi deb belgilash" : null;
  const mapsUrl   = problem.latitude && problem.longitude
    ? `https://www.google.com/maps?q=${problem.latitude},${problem.longitude}` : null;

  const images = files.filter(f => f.fileType === "IMAGE" || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.fileName));
  const docs   = files.filter(f => !images.find(img => img.id === f.id));
  const curOrder = STEPS.findIndex(s => s.key === problem.status);

  return (
    <div className="max-w-5xl space-y-6">

      {/* ══ TOP ACCENT LINE ══ */}
      <div className="h-px rounded-full" style={{ background:`linear-gradient(90deg,transparent,${sc.color}80,transparent)` }} />

      {/* ══ HEADER ══ */}
      <div className="flex items-start gap-4">
        {/* Back */}
        <button onClick={() => router.back()}
          className="mt-1 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all text-sm font-bold"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(160,190,240,0.6)" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
          ←
        </button>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg"
              style={{ background:"rgba(255,255,255,0.07)", color:"rgba(120,150,200,0.65)" }}>
              #{problem.id}
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold"
              style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}45`, boxShadow:`0 0 10px ${sc.glow}` }}>
              {sc.label}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
              style={{ background:`${tcolor}15`, color:tcolor, border:`1px solid ${tcolor}30` }}>
              {typeIcon} {problem.type}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
            {problem.title}
          </h1>
          {problem.createdAt && (
            <p className="text-xs mt-1.5" style={{ color:"rgba(100,130,200,0.45)" }}>
              {new Date(problem.createdAt).toLocaleString("uz-UZ")}
            </p>
          )}
        </div>

        {/* Advance button */}
        {nextLabel && (
          <button disabled={updating} onClick={handleAdvance}
            className="mt-1 flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: problem.status==="YANGI" ? "rgba(96,165,250,0.15)" : "rgba(52,211,153,0.15)",
              color:      problem.status==="YANGI" ? "#60a5fa" : "#34d399",
              border:     problem.status==="YANGI" ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(52,211,153,0.4)",
              boxShadow:  problem.status==="YANGI" ? "0 0 16px rgba(96,165,250,0.15)" : "0 0 16px rgba(52,211,153,0.15)",
              opacity: updating ? 0.6 : 1,
            }}>
            {updating ? "Saqlanmoqda..." : nextLabel}
          </button>
        )}
      </div>

      {/* ══ BODY ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ─── Left (2 cols) ─── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tavsif */}
          <Card>
            <CardLabel>Muammo tavsifi</CardLabel>
            <p className="text-sm leading-relaxed" style={{ color:"rgba(190,215,255,0.82)" }}>
              {problem.description || <span style={{ color:"rgba(100,130,200,0.35)", fontStyle:"italic" }}>Izoh kiritilmagan</span>}
            </p>
          </Card>

          {/* Rasmlar */}
          {images.length > 0 && (
            <Card>
              <CardLabel>Rasmlar ({images.length})</CardLabel>
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div key={img.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                    {/* Index */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background:"rgba(255,255,255,0.06)", color:"rgba(130,160,210,0.6)" }}>
                      {idx + 1}
                    </div>
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.2)" }}>
                      🖼️
                    </div>
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color:"rgba(190,215,255,0.85)" }}>
                        {img.title || img.fileName}
                      </p>
                      <p className="text-xs truncate" style={{ color:"rgba(100,130,200,0.4)" }}>
                        {img.fileName}
                      </p>
                    </div>
                    {/* Ko'rish tugmasi */}
                    <button
                      onClick={() => setActiveImg(`${API_BASE}${img.fileUrl}`)}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background:"rgba(96,165,250,0.12)", color:"#60a5fa", border:"1px solid rgba(96,165,250,0.3)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="rgba(96,165,250,0.22)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="rgba(96,165,250,0.12)")}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ko&apos;rish
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Lokatsiya */}
          {mapsUrl && (
            <Card>
              <CardLabel>Lokatsiya</CardLabel>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)" }}>
                  📍
                </div>
                <div>
                  <p className="text-sm font-mono font-semibold mb-1" style={{ color:"rgba(190,215,255,0.85)" }}>
                    {problem.latitude?.toFixed(6)},&nbsp;{problem.longitude?.toFixed(6)}
                  </p>
                  <a href={mapsUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all"
                    style={{ color:GOLD }}
                    onMouseEnter={e=>(e.currentTarget.style.opacity="0.7")}
                    onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Google Maps da ochish
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Qo'shimcha fayllar */}
          {docs.length > 0 && (
            <Card>
              <CardLabel>Fayllar ({docs.length})</CardLabel>
              <div className="space-y-2">
                {docs.map(f => (
                  <a key={f.id} href={`${API_BASE}${f.fileUrl}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e=>(e.currentTarget.style.borderColor=`${GOLD}40`)}
                    onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)")}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background:`${GOLD}12`, border:`1px solid ${GOLD}25` }}>
                      📎
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color:"rgba(190,215,255,0.85)" }}>{f.title}</p>
                      <p className="text-xs truncate" style={{ color:"rgba(100,130,200,0.45)" }}>{f.fileName}</p>
                    </div>
                    <span className="text-sm" style={{ color:GOLD }}>↓</span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ─── Right (1 col) ─── */}
        <div className="space-y-4">

          {/* Muammo turi */}
          <Card>
            <CardLabel>Muammo turi</CardLabel>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                style={{ background:`${tcolor}15`, border:`1px solid ${tcolor}30` }}>
                {typeIcon}
              </div>
              <span className="text-base font-bold" style={{ color: tcolor }}>{problem.type}</span>
            </div>
          </Card>

          {/* Loyiha */}
          <Card>
            <CardLabel>Loyiha</CardLabel>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mt-0.5 flex-shrink-0"
                style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.25)" }}>
                🏗️
              </div>
              <p className="text-sm font-semibold leading-snug" style={{ color:"rgba(210,225,255,0.9)" }}>
                {problem.projectName ?? problem.project?.name ?? `#${problem.projectId}`}
              </p>
            </div>
          </Card>

          {/* Yuboruvchi */}
          <Card>
            <CardLabel>Yuboruvchi</CardLabel>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background:"rgba(59,130,246,0.15)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.25)" }}>
                {(problem.createdByFullName ?? "?")[0]?.toUpperCase()}
              </div>
              <p className="text-sm font-semibold" style={{ color:"rgba(210,225,255,0.9)" }}>
                {problem.createdByFullName ?? "—"}
              </p>
            </div>
          </Card>

          {/* Mas'ul bo'lim */}
          {(problem.department || problem.responsibleDepartment) && (
            <Card>
              <CardLabel>Mas&apos;ul bo&apos;lim</CardLabel>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background:`${GOLD}12`, border:`1px solid ${GOLD}25` }}>
                  🏢
                </div>
                <p className="text-sm font-semibold" style={{ color:"rgba(210,225,255,0.9)" }}>
                  {problem.department ?? problem.responsibleDepartment}
                </p>
              </div>
            </Card>
          )}

          {/* Vaqt */}
          {problem.createdAt && (
            <Card>
              <CardLabel>Yuborilgan vaqt</CardLabel>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background:"rgba(100,130,200,0.1)", border:"1px solid rgba(100,130,200,0.2)" }}>
                  🕐
                </div>
                <p className="text-sm font-semibold" style={{ color:"rgba(210,225,255,0.9)" }}>
                  {new Date(problem.createdAt).toLocaleString("uz-UZ")}
                </p>
              </div>
            </Card>
          )}

          {/* Jarayon bosqichlari */}
          <Card>
            <CardLabel>Jarayon</CardLabel>
            <div className="relative">
              {/* Vertical connector */}
              <div className="absolute left-[15px] top-4 bottom-4 w-px"
                style={{ background:"rgba(255,255,255,0.07)" }} />
              <div className="space-y-4">
                {STEPS.map((step) => {
                  const done    = step.order <= curOrder;
                  const current = step.order === curOrder;
                  const c       = sCfg(step.key);
                  return (
                    <div key={step.key} className="flex items-center gap-3 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 transition-all"
                        style={{
                          background: done ? `${c.color}20` : "rgba(30,40,65,0.9)",
                          border: `1.5px solid ${done ? c.color : "rgba(255,255,255,0.1)"}`,
                          boxShadow: current ? `0 0 12px ${c.glow}` : "none",
                        }}>
                        {done ? <span style={{ fontSize:14 }}>{step.icon}</span>
                               : <span style={{ color:"rgba(100,130,200,0.3)", fontSize:12 }}>○</span>}
                      </div>
                      <div>
                        <p className="text-xs font-semibold"
                          style={{ color: done ? "rgba(210,225,255,0.9)" : "rgba(100,130,200,0.38)" }}>
                          {step.label}
                        </p>
                        {current && (
                          <p className="text-[10px] font-medium mt-0.5" style={{ color: c.color }}>
                            Hozirgi holat
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ══ FULLSCREEN IMAGE ══ */}
      {activeImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background:"rgba(0,0,0,0.9)", backdropFilter:"blur(12px)" }}
          onClick={() => setActiveImg(null)}>
          <div className="relative max-w-5xl max-h-[92vh] p-4 w-full"
            onClick={e => e.stopPropagation()}>
            <img src={activeImg} alt="Rasm"
              className="w-full h-full object-contain rounded-2xl"
              style={{ maxHeight:"84vh", boxShadow:"0 25px 80px rgba(0,0,0,0.7)" }} />
            <button onClick={() => setActiveImg(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all"
              style={{ background:"rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.2)", color:"white", fontSize:14 }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.15)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(0,0,0,0.7)")}>
              ✕
            </button>
            <a href={activeImg} download target="_blank" rel="noreferrer"
              className="absolute bottom-6 right-6 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl"
              style={{ background:`${GOLD}18`, color:GOLD, border:`1px solid ${GOLD}35`, backdropFilter:"blur(8px)" }}>
              ↓ Yuklab olish
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
