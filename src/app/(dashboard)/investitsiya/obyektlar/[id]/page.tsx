"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, getProjectTasks, getProjectTasksGrouped, importProjectTasks, importProjectTasksDocx } from "@/services/projectService";
import { getProjectUpdates } from "@/services/projectUpdateService";
import type { Project, ProjectTask, ProjectTaskGroup, ProjectUpdate } from "@/types/api.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const UPDATE_STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  REJALASHTIRILGAN: { label:"Rejalashtirilgan", color:"#1d4ed8", bg:"#eff6ff",  border:"#bfdbfe",  emoji:"🗓️" },
  JARAYONDA:        { label:"Jarayonda",         color:"#d97706", bg:"#fffbeb",  border:"#fde68a",  emoji:"⚡" },
  KECHIKKAN:        { label:"Kechikkan",         color:"#ea580c", bg:"#fff7ed",  border:"#fed7aa",  emoji:"⏰" },
  MUAMMOLI:         { label:"Muammoli",          color:"#dc2626", bg:"#fef2f2",  border:"#fecaca",  emoji:"⚠️" },
  TUGALLANGAN:      { label:"Tugallangan",       color:"#16a34a", bg:"#f0fdf4",  border:"#bbf7d0",  emoji:"✅" },
};

const N="#0d1f3c", G="#c9a84c", CD="#f0ead8", CDD="#e4dbc8", T2="#8896b0", T3="#b0bdd4";

const STATUS_CFG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  YANGI:       { color:"#0891b2", bg:"#ecfeff",  border:"#a5f3fc",  label:"Yangi"       },
  JARAYONDA:   { color:"#1d4ed8", bg:"#eff6ff",  border:"#bfdbfe",  label:"Jarayonda"   },
  TUGALLANGAN: { color:"#16a34a", bg:"#f0fdf4",  border:"#bbf7d0",  label:"Tugallangan" },
  MUAMMOLI:    { color:"#dc2626", bg:"#fef2f2",  border:"#fecaca",  label:"Muammoli"    },
  KECHIKKAN:   { color:"#d97706", bg:"#fffbeb",  border:"#fde68a",  label:"Kechikkan"   },
};
const getStatus = (s: string) => STATUS_CFG[s] ?? { color:"#475569", bg:"#f8fafc", border:"#e2e8f0", label:s };

const fmtMoney = (v?: number | null) => {
  if (!v) return "—";
  if (v >= 1_000_000_000) return `${(v/1_000_000_000).toFixed(2)} mlrd so'm`;
  if (v >= 1_000_000)     return `${(v/1_000_000).toFixed(2)} mln so'm`;
  return new Intl.NumberFormat("uz-UZ").format(v) + " so'm";
};

const fmtDate = (d?: string | null) => {
  if (!d) return "—";
  const dt = new Date(d);
  const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
};

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background:"#fff", border:`1px solid ${CDD}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background:CD, color:T2 }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color:T3 }}>{label}</p>
        <p className="text-sm font-semibold truncate" style={{ color:N }}>{value}</p>
      </div>
    </div>
  );
}

export default function ObyektDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const fileRef      = useRef<HTMLInputElement>(null);
  const fileDocxRef  = useRef<HTMLInputElement>(null);

  const [project,      setProject]      = useState<Project | null>(null);
  const [tasks,        setTasks]        = useState<ProjectTask[]>([]);
  const [grouped,      setGrouped]      = useState<ProjectTaskGroup[]>([]);
  const [updates,      setUpdates]      = useState<ProjectUpdate[]>([]);
  const [updatesLoad,  setUpdatesLoad]  = useState(true);
  const [modalImg,     setModalImg]     = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [tasksLoad,    setTasksLoad]    = useState(true);
  const [groupedLoad,  setGroupedLoad]  = useState(true);
  const [selFile,      setSelFile]      = useState<File | null>(null);
  const [selDocx,      setSelDocx]      = useState<File | null>(null);
  const [importing,    setImporting]    = useState(false);
  const [importingDocx,setImportingDocx]= useState(false);
  const [importMsg,    setImportMsg]    = useState<{ type:"ok"|"err"; text:string } | null>(null);
  const [importDocxMsg,setImportDocxMsg]= useState<{ type:"ok"|"err"; text:string } | null>(null);
  const [drag,         setDrag]         = useState(false);
  const [dragDocx,     setDragDocx]     = useState(false);

  useEffect(() => {
    getProject(Number(id))
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));

    setTasksLoad(true);
    getProjectTasks(Number(id))
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setTasksLoad(false));

    setGroupedLoad(true);
    getProjectTasksGrouped(Number(id))
      .then(setGrouped)
      .catch(() => setGrouped([]))
      .finally(() => setGroupedLoad(false));

    setUpdatesLoad(true);
    getProjectUpdates(Number(id))
      .then(u => setUpdates([...u].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => setUpdates([]))
      .finally(() => setUpdatesLoad(false));
  }, [id]);

  const refreshFlat = () => {
    setTasksLoad(true);
    getProjectTasks(Number(id)).then(setTasks).catch(()=>setTasks([])).finally(()=>setTasksLoad(false));
  };

  const refreshGrouped = () => {
    setGroupedLoad(true);
    getProjectTasksGrouped(Number(id)).then(setGrouped).catch(()=>setGrouped([])).finally(()=>setGroupedLoad(false));
  };

  const handleImport = async () => {
    if (!selFile) return;
    setImporting(true); setImportMsg(null);
    try {
      await importProjectTasks(Number(id), selFile);
      setImportMsg({ type:"ok", text:"Excel/CSV fayldan vazifalar muvaffaqiyatli import qilindi!" });
      setSelFile(null);
      refreshFlat();
    } catch {
      setImportMsg({ type:"err", text:"Import qilishda xatolik yuz berdi. Fayl formatini tekshiring." });
    } finally {
      setImporting(false);
    }
  };

  const handleImportDocx = async () => {
    if (!selDocx) return;
    setImportingDocx(true); setImportDocxMsg(null);
    try {
      await importProjectTasksDocx(Number(id), selDocx);
      setImportDocxMsg({ type:"ok", text:"Word fayldan vazifalar muvaffaqiyatli import qilindi!" });
      setSelDocx(null);
      refreshGrouped();
    } catch {
      setImportDocxMsg({ type:"err", text:"Import qilishda xatolik yuz berdi. Fayl formatini tekshiring." });
    } finally {
      setImportingDocx(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) { setSelFile(f); setImportMsg(null); }
  };

  if (loading) {
    return (
      <div className="-m-6 flex items-center justify-center" style={{ minHeight:"calc(100vh - 60px)", background:"#faf7f0" }}>
        <div className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor:`${N}20`, borderTopColor:N }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="-m-6 flex items-center justify-center" style={{ minHeight:"calc(100vh - 60px)", background:"#faf7f0" }}>
        <div className="text-center">
          <p className="text-2xl font-bold mb-2" style={{ color:N }}>404</p>
          <p className="text-sm mb-4" style={{ color:T2 }}>Loyiha topilmadi</p>
          <button onClick={()=>router.back()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background:N }}>
            Orqaga
          </button>
        </div>
      </div>
    );
  }

  const sm  = getStatus(project.status);
  const loc = [project.address, project.district, project.region].filter(Boolean).join(", ") || "—";
  const spentPct = project.allocatedMoney && project.spentMoney
    ? Math.min(Math.round((project.spentMoney / project.allocatedMoney) * 100), 100)
    : 0;

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight:"calc(100vh - 60px)", background:"#faf7f0" }}>

      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4"
        style={{ background:"#fff", borderBottom:`1px solid ${CDD}`, boxShadow:`0 1px 0 ${CDD}` }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Back */}
            <button onClick={()=>router.back()}
              className="w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 transition-all flex-shrink-0"
              style={{ background:CD, border:`1px solid ${CDD}`, color:T2 }}
              onMouseEnter={e=>(e.currentTarget.style.background=CDD)}
              onMouseLeave={e=>(e.currentTarget.style.background=CD)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8" }}>
                  {project.type}
                </span>
                <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ background:sm.bg, border:`1px solid ${sm.border}`, color:sm.color }}>
                  {sm.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg"
                  style={{ background:CD, color:T3 }}>
                  #{project.id}
                </span>
              </div>
              <h1 className="text-xl font-bold" style={{ color:N }}>{project.name}</h1>
              {project.description && (
                <p className="text-xs mt-1 max-w-xl" style={{ color:T2 }}>{project.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex-1 space-y-5">

        {/* Info grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard label="MAS'UL SHAXS" value={project.ownerFullName ?? `ID: ${project.ownerId}`}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          <InfoCard label="INVESTOR" value={project.investorName || "—"}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} />
          <InfoCard label="JOYLASHUV" value={loc}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} />
          <InfoCard label="HOLAT" value={sm.label}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        </div>

        {/* Money + Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Budget card */}
          <div className="rounded-2xl p-5" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <p className="text-sm font-bold" style={{ color:N }}>Moliyaviy ko&apos;rsatkichlar</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color:T2 }}>Ajratilgan mablag&apos;</span>
                <span className="text-sm font-bold" style={{ color:N }}>{fmtMoney(project.allocatedMoney)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color:T2 }}>Sarflangan mablag&apos;</span>
                <span className="text-sm font-bold" style={{ color:"#d97706" }}>{fmtMoney(project.spentMoney)}</span>
              </div>
              {project.allocatedMoney ? (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px]" style={{ color:T3 }}>Sarflangan ulushi</span>
                    <span className="text-[11px] font-bold" style={{ color:"#d97706" }}>{spentPct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:CD }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${spentPct}%`, background:`linear-gradient(90deg, #1d4ed8, #d97706)` }} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Dates card */}
          <div className="rounded-2xl p-5" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p className="text-sm font-bold" style={{ color:N }}>Muddatlar</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color:T2 }}>Boshlanish sanasi</span>
                <span className="text-sm font-semibold" style={{ color:N }}>{fmtDate(project.startDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color:T2 }}>Tugash sanasi (reja)</span>
                <span className="text-sm font-semibold" style={{ color:N }}>{fmtDate(project.plannedEndDate)}</span>
              </div>
              {project.actualEndDate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium" style={{ color:T2 }}>Tugash sanasi (haqiqiy)</span>
                  <span className="text-sm font-semibold" style={{ color:"#16a34a" }}>{fmtDate(project.actualEndDate)}</span>
                </div>
              )}
              {project.latitude && project.longitude && (
                <div className="flex justify-between items-center pt-1" style={{ borderTop:`1px solid ${CD}` }}>
                  <span className="text-xs font-medium" style={{ color:T2 }}>Koordinatalar</span>
                  <span className="text-xs font-mono" style={{ color:T3 }}>
                    {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${CDD}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color:N }}>Vazifalar</p>
                <p className="text-[11px]" style={{ color:T2 }}>
                  {tasksLoad ? "yuklanmoqda..." : `${tasks.length} ta vazifa`}
                </p>
              </div>
            </div>
          </div>

          {tasksLoad ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background:CD }} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:CD }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T3} strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color:T2 }}>Hozircha vazifalar yo&apos;q</p>
              <p className="text-xs" style={{ color:T3 }}>Quyidagi forma orqali import qiling</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ background:"#faf7f0" }}>
                    {[
                      { label:"#",           w:"48px"  },
                      { label:"NOMI",        w:"auto"  },
                      { label:"HOLAT",       w:"100px" },
                      { label:"BAJARILDI",   w:"90px"  },
                      { label:"JAMI (mln)",  w:"110px" },
                      { label:"2026 (mln)",  w:"110px" },
                      { label:"2027 (mln)",  w:"110px" },
                      { label:"BOSHLANISH",  w:"110px" },
                      { label:"TUGASH",      w:"110px" },
                    ].map(h => (
                      <th key={h.label} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest whitespace-nowrap"
                        style={{ color:T2, borderBottom:`1.5px solid ${CDD}`, width:h.w }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t, i) => {
                    const statusCfg: Record<string,{bg:string;color:string;border:string;label:string}> = {
                      REJADA:      {bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe", label:"Rejada"     },
                      JARAYONDA:   {bg:"#fffbeb", color:"#d97706", border:"#fde68a", label:"Jarayonda"  },
                      TUGALLANGAN: {bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"Tugallangan"},
                      MUAMMOLI:    {bg:"#fef2f2", color:"#dc2626", border:"#fecaca", label:"Muammoli"   },
                    };
                    const sc = statusCfg[t.status?.toUpperCase() ?? ""] ?? {bg:"#f8fafc", color:"#475569", border:"#e2e8f0", label: t.status ?? "—"};

                    return (
                      <tr key={`${t.id ?? ""}-${i}`} className="transition-colors"
                        style={{ borderBottom:`1px solid ${CD}` }}
                        onMouseEnter={e=>(e.currentTarget.style.background=CD)}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>

                        {/* # */}
                        <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color:T3 }}>
                          {t.orderNumber ?? i + 1}
                        </td>

                        {/* Nomi */}
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold" style={{ color:N, maxWidth:320 }}>{t.title ?? "—"}</p>
                          {t.unit && <p className="text-[11px] mt-0.5" style={{ color:T3 }}>{t.unit}</p>}
                        </td>

                        {/* Holat */}
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap"
                            style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                            {sc.label}
                          </span>
                        </td>

                        {/* Bajarildi */}
                        <td className="px-4 py-3">
                          {t.completed
                            ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }}>✓ Ha</span>
                            : <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>✗ Yo&apos;q</span>
                          }
                        </td>

                        {/* Jami summa */}
                        <td className="px-4 py-3 text-xs font-semibold text-right" style={{ color:N }}>
                          {t.totalAmount != null ? t.totalAmount.toLocaleString("uz-UZ") : "—"}
                        </td>

                        {/* 2026 */}
                        <td className="px-4 py-3 text-xs font-semibold text-right" style={{ color:"#1d4ed8" }}>
                          {t.amount2026 != null ? t.amount2026.toLocaleString("uz-UZ") : "—"}
                        </td>

                        {/* 2027 */}
                        <td className="px-4 py-3 text-xs font-semibold text-right" style={{ color:"#7c3aed" }}>
                          {t.amount2027 != null ? t.amount2027.toLocaleString("uz-UZ") : "—"}
                        </td>

                        {/* Boshlanish */}
                        <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color:T2 }}>
                          {fmtDate(t.startDate)}
                        </td>

                        {/* Tugash */}
                        <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color:T2 }}>
                          {fmtDate(t.endDate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Grouped Tasks */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${CDD}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"#faf5ff", border:"1px solid #e9d5ff" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8">
                  <path d="M3 6h18M3 12h18M3 18h18"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color:N }}>Qarorlar bo&apos;yicha vazifalar</p>
                <p className="text-[11px]" style={{ color:T2 }}>
                  {groupedLoad ? "yuklanmoqda..." : `${grouped.length} ta qaror, ${grouped.reduce((s,g)=>s+g.tasks.length,0)} ta vazifa`}
                </p>
              </div>
            </div>
          </div>

          {groupedLoad ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background:CD }} />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-sm font-medium" style={{ color:T2 }}>Hozircha ma&apos;lumot yo&apos;q</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor:CD }}>
              {grouped.map((group, gi) => {
                const statusCfg: Record<string,{bg:string;color:string;border:string;label:string}> = {
                  REJADA:      {bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe", label:"Rejada"     },
                  JARAYONDA:   {bg:"#fffbeb", color:"#d97706", border:"#fde68a", label:"Jarayonda"  },
                  TUGALLANGAN: {bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"Tugallangan"},
                  MUAMMOLI:    {bg:"#fef2f2", color:"#dc2626", border:"#fecaca", label:"Muammoli"   },
                };
                return (
                  <div key={gi}>
                    {/* Decision header */}
                    <div className="px-5 py-2.5 flex items-center gap-2"
                      style={{ background:"#faf5ff", borderBottom:`1px solid #e9d5ff` }}>
                      <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg"
                        style={{ background:"#ede9fe", color:"#7c3aed", border:"1px solid #ddd6fe" }}>
                        QAROR
                      </span>
                      <p className="text-xs font-semibold" style={{ color:N }}>{group.decision}</p>
                      <span className="ml-auto text-[10px] font-mono" style={{ color:T3 }}>
                        {group.tasks.length} ta vazifa
                      </span>
                    </div>
                    {/* Tasks table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr style={{ background:"#faf7f0" }}>
                            {["#","NOMI","HOLAT","BAJARILDI","JAMI","2026","2027","BOSHLANISH","TUGASH"].map(h => (
                              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest whitespace-nowrap"
                                style={{ color:T2, borderBottom:`1px solid ${CDD}` }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.tasks.map((t, i) => {
                            const sc = statusCfg[t.status?.toUpperCase() ?? ""] ?? {bg:"#f8fafc", color:"#475569", border:"#e2e8f0", label: t.status ?? "—"};
                            return (
                              <tr key={`${gi}-${t.id ?? ""}-${i}`} className="transition-colors"
                                style={{ borderBottom:`1px solid ${CD}` }}
                                onMouseEnter={e=>(e.currentTarget.style.background=CD)}
                                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <td className="px-4 py-2.5 text-xs font-mono font-semibold" style={{ color:T3 }}>{t.orderNumber ?? i+1}</td>
                                <td className="px-4 py-2.5">
                                  <p className="text-sm font-semibold" style={{ color:N, maxWidth:300 }}>{t.title ?? "—"}</p>
                                  {t.unit && <p className="text-[11px]" style={{ color:T3 }}>{t.unit}</p>}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap"
                                    style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                                    {sc.label}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5">
                                  {t.completed
                                    ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }}>✓ Ha</span>
                                    : <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>✗ Yo&apos;q</span>
                                  }
                                </td>
                                <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color:N }}>
                                  {t.totalAmount != null ? t.totalAmount.toLocaleString("uz-UZ") : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color:"#1d4ed8" }}>
                                  {t.amount2026 != null ? t.amount2026.toLocaleString("uz-UZ") : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color:"#7c3aed" }}>
                                  {t.amount2027 != null ? t.amount2027.toLocaleString("uz-UZ") : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-xs font-mono whitespace-nowrap" style={{ color:T2 }}>{fmtDate(t.startDate)}</td>
                                <td className="px-4 py-2.5 text-xs font-mono whitespace-nowrap" style={{ color:T2 }}>{fmtDate(t.endDate)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Yangiliklar (Project Updates) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
          <div style={{ height:3, background:"linear-gradient(90deg, #f59e0b 0%, #10b981 100%)" }} />
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${CDD}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"#fffbeb", border:"1px solid #fde68a" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color:N }}>Jarayon ma&apos;lumotlari</p>
                <p className="text-[11px]" style={{ color:T2 }}>
                  {updatesLoad ? "yuklanmoqda..." : `${updates.length} ta yangilik`}
                </p>
              </div>
            </div>
          </div>

          {updatesLoad ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background:CD }} />
              ))}
            </div>
          ) : updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:CD }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T3} strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color:T2 }}>Hozircha ma&apos;lumot yuborilmagan</p>
              <p className="text-xs" style={{ color:T3 }}>Tadbirkor loyiha jarayoni haqida ma&apos;lumot yuborganda bu yerda ko&apos;rinadi</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor:CD }}>
              {updates.map((u, i) => {
                const uc = UPDATE_STATUS_CFG[u.status] ?? { label:u.status, color:"#475569", bg:"#f8fafc", border:"#e2e8f0", emoji:"📋" };
                const imgSrc = u.imageUrl ? `${API_BASE}${u.imageUrl}` : null;

                // Parse GPS coords from description ("📍 Lokatsiya: lat, lon")
                const locMatch = u.description?.match(/📍?\s*Lokatsiya:\s*([\d.]+),\s*([\d.]+)/);
                const gpsCoords = locMatch ? { lat: locMatch[1], lon: locMatch[2] } : null;
                const cleanDesc = u.description
                  ?.replace(/\n?📍?\s*Lokatsiya:\s*[\d.]+,\s*[\d.]+/, "")
                  .trim() || null;

                return (
                  <div key={u.id} className="px-5 py-4 transition-colors"
                    style={{ background: i % 2 === 0 ? "#fff" : "#faf9f7" }}>
                    <div className="flex items-start gap-4">
                      {/* Status circle */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background:uc.bg, border:`1.5px solid ${uc.border}` }}>
                        {uc.emoji}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color:N }}>{u.title}</p>
                            {cleanDesc && (
                              <p className="text-xs mt-1" style={{ color:T2 }}>{cleanDesc}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-[11px] flex-wrap" style={{ color:T3 }}>
                              {u.createdByFullName && <span>👤 {u.createdByFullName}</span>}
                              {u.createdAt && (
                                <span>🕐 {new Date(u.createdAt).toLocaleDateString("uz-UZ")} {new Date(u.createdAt).toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"})}</span>
                              )}
                            </div>

                            {/* Location button */}
                            {gpsCoords && (
                              <div className="mt-2">
                                <a href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lon}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                                  style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0", textDecoration:"none" }}
                                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background="#dcfce7"}
                                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background="#f0fdf4"}>
                                  📍 Lokatsiya ({gpsCoords.lat}, {gpsCoords.lon})
                                </a>
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0"
                            style={{ background:uc.bg, color:uc.color, border:`1px solid ${uc.border}` }}>
                            {uc.label}
                          </span>
                        </div>

                        {/* RASMLAR section */}
                        {imgSrc && (
                          <div className="mt-3 pt-3" style={{ borderTop:`1px solid ${CD}` }}>
                            <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color:T3 }}>
                              RASMLAR (1)
                            </p>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                              style={{ background:CD, border:`1px solid ${CDD}` }}>
                              {/* Number badge */}
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background:"#fff", border:`1px solid ${CDD}`, color:T2 }}>
                                1
                              </div>
                              {/* Thumbnail */}
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                                style={{ border:`1px solid ${CDD}` }}>
                                <img src={imgSrc} alt="rasm" className="w-full h-full object-cover" />
                              </div>
                              {/* Filename */}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold" style={{ color:N }}>
                                  {u.imageUrl?.includes("telegram") ? "Telegram rasm" : "Rasm"}
                                </p>
                                <p className="text-[10px] truncate" style={{ color:T3 }}>
                                  {u.imageUrl?.split("/").pop() ?? "rasm.jpg"}
                                </p>
                              </div>
                              {/* Ko'rish button */}
                              <button onClick={() => setModalImg(imgSrc)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 transition-all"
                                style={{ background:"#fff", border:`1px solid ${CDD}`, color:N }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background=CDD}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="#fff"}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Ko&apos;rish
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* File import — ikki blok yonma-yon */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── Excel/CSV import ── */}
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
          <div style={{ height:3, background:`linear-gradient(90deg, #16a34a 0%, #0891b2 100%)` }} />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color:N }}>Excel / CSV import</p>
                <p className="text-[11px]" style={{ color:T2 }}>.xlsx, .xls, .csv fayl orqali yuklang</p>
              </div>
            </div>

            {/* Drop zone */}
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-3 py-10 transition-all cursor-pointer"
              style={{
                border: drag ? `2px dashed ${N}` : selFile ? `2px dashed ${G}` : `2px dashed ${CDD}`,
                background: drag ? `${N}06` : selFile ? `${G}08` : CD,
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}>
              {selFile ? (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background:`${G}15`, border:`1px solid ${G}40` }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color:N }}>{selFile.name}</p>
                    <p className="text-xs mt-0.5" style={{ color:T2 }}>
                      {(selFile.size / 1024).toFixed(1)} KB • Yuklashga tayyor
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSelFile(null); setImportMsg(null); }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                    Bekor qilish
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background:CDD }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T2} strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color:N }}>
                      Faylni bu yerga tashlang
                    </p>
                    <p className="text-xs mt-1" style={{ color:T2 }}>
                      yoki bosib tanlang · Excel, CSV qabul qilinadi
                    </p>
                  </div>
                </>
              )}
              <input ref={fileRef} type="file" className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setSelFile(f); setImportMsg(null); } e.target.value=""; }} />
            </div>

            {/* Status message */}
            {importMsg && (
              <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
                style={importMsg.type === "ok"
                  ? { background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }
                  : { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                {importMsg.type === "ok"
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                {importMsg.text}
              </div>
            )}

            {/* Upload button */}
            <div className="mt-4 flex justify-end">
              <button onClick={handleImport} disabled={!selFile || importing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: !selFile || importing ? "#16a34a88" : "#16a34a", cursor: !selFile || importing ? "not-allowed" : "pointer" }}>
                {importing && <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(255,255,255,0.3)", borderTopColor:"#fff" }} />}
                {importing ? "Yuklanmoqda..." : "Excel import"}
              </button>
            </div>
          </div>
          </div>

          {/* ── Word/DOCX import ── */}
          <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:`1px solid ${CDD}` }}>
            <div style={{ height:3, background:`linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%)` }} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color:N }}>Word / DOCX import</p>
                  <p className="text-[11px]" style={{ color:T2 }}>.docx fayl orqali yuklang</p>
                </div>
              </div>

              {/* Drop zone */}
              <div className="rounded-2xl flex flex-col items-center justify-center gap-3 py-10 transition-all cursor-pointer"
                style={{
                  border: dragDocx ? "2px dashed #1d4ed8" : selDocx ? "2px dashed #7c3aed" : `2px dashed ${CDD}`,
                  background: dragDocx ? "#eff6ff" : selDocx ? "#faf5ff" : CD,
                }}
                onClick={() => fileDocxRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragDocx(true); }}
                onDragLeave={() => setDragDocx(false)}
                onDrop={e => {
                  e.preventDefault(); setDragDocx(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) { setSelDocx(f); setImportDocxMsg(null); }
                }}>
                {selDocx ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color:N }}>{selDocx.name}</p>
                      <p className="text-xs mt-0.5" style={{ color:T2 }}>{(selDocx.size/1024).toFixed(1)} KB • Yuklashga tayyor</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setSelDocx(null); setImportDocxMsg(null); }}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                      Bekor qilish
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:CDD }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T2} strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color:N }}>Word faylni tashlang</p>
                      <p className="text-xs mt-1" style={{ color:T2 }}>yoki bosib tanlang · .docx qabul qilinadi</p>
                    </div>
                  </>
                )}
                <input ref={fileDocxRef} type="file" className="hidden" accept=".docx,.doc"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { setSelDocx(f); setImportDocxMsg(null); } e.target.value=""; }} />
              </div>

              {importDocxMsg && (
                <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
                  style={importDocxMsg.type === "ok"
                    ? { background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }
                    : { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                  {importDocxMsg.type === "ok"
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                  {importDocxMsg.text}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button onClick={handleImportDocx} disabled={!selDocx || importingDocx}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: !selDocx || importingDocx ? "#1d4ed888" : "#1d4ed8", cursor: !selDocx || importingDocx ? "not-allowed" : "pointer" }}>
                  {importingDocx && <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(255,255,255,0.3)", borderTopColor:"#fff" }} />}
                  {importingDocx ? "Yuklanmoqda..." : "Word import"}
                </button>
              </div>
            </div>
          </div>

        </div>{/* /grid */}

      </div>

      {/* Image Modal */}
      {modalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(13,31,60,0.85)", backdropFilter:"blur(4px)" }}
          onClick={() => setModalImg(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalImg(null)}
              className="absolute -top-10 right-0 text-white text-sm font-bold px-3 py-1 rounded-lg"
              style={{ background:"rgba(255,255,255,0.15)" }}>
              ✕ Yopish
            </button>
            <img src={modalImg} alt="yangilik rasmi"
              className="w-full rounded-2xl object-contain"
              style={{ maxHeight:"80vh", border:`1px solid ${CDD}` }} />
            <a href={modalImg} download
              className="block mt-3 text-center text-sm font-bold py-2.5 rounded-xl text-white"
              style={{ background:N }}>
              ⬇️ Yuklab olish
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
