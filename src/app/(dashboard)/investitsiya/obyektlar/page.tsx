"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject, updateProject, deleteProject } from "@/services/projectService";
import { getUsers } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { Project, ProjectCreateDto, ApiUser } from "@/types/api.types";

const N="#0d1f3c", G="#c9a84c", CD="#f0ead8", CDD="#e4dbc8", T2="#8896b0", T3="#b0bdd4";

const STATUS_CFG = {
  YANGI:       { label:"Yangi",       color:"#0891b2", bg:"#ecfeff",  border:"#a5f3fc"  },
  JARAYONDA:   { label:"Jarayonda",   color:"#1d4ed8", bg:"#eff6ff",  border:"#bfdbfe"  },
  TUGALLANGAN: { label:"Tugallangan", color:"#16a34a", bg:"#f0fdf4",  border:"#bbf7d0"  },
  MUAMMOLI:    { label:"Muammoli",    color:"#dc2626", bg:"#fef2f2",  border:"#fecaca"  },
  KECHIKKAN:   { label:"Kechikkan",   color:"#d97706", bg:"#fffbeb",  border:"#fde68a"  },
} as const;
type SK = keyof typeof STATUS_CFG;
const fallback = (s: string) => STATUS_CFG[s as SK] ?? { label:s, color:"#475569", bg:"#f8fafc", border:"#e2e8f0" };
const STATUSES: SK[] = ["YANGI","JARAYONDA","TUGALLANGAN","MUAMMOLI","KECHIKKAN"];
const PAGE_SIZE = 10;

const INIT: Partial<ProjectCreateDto> = {
  name:"", description:"", status:"YANGI",
  investorName:"", allocatedMoney:0, spentMoney:0,
  startDate:"", plannedEndDate:"",
  region:"", district:"", address:"", latitude:0, longitude:0,
  ownerId:0,
};

const selBase  = "px-3 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer appearance-none";
const selStyle = { background: "#fff", border: `1.5px solid ${CDD}`, color: N };
const inpClass = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inpStyle = { background: CD, border: `1.5px solid ${CDD}`, color: N };

const fmtMoney = (v?: number) =>
  v ? new Intl.NumberFormat("uz-UZ").format(v) + " so'm" : "—";

export default function InvestObyektlarPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isHokim = user?.role === "HOKIM" || user?.role === "hokim";
  const [items,    setItems]    = useState<Project[]>([]);
  const [users,    setUsers]    = useState<ApiUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("Barcha holatlar");
  const [page,     setPage]     = useState(1);
  const [modal,    setModal]    = useState<"create"|"edit"|null>(null);
  const [editing,  setEditing]  = useState<Project|null>(null);
  const [form,     setForm]     = useState<Partial<ProjectCreateDto>>(INIT);
  const [saving,   setSaving]   = useState(false);
  const [delId,    setDelId]    = useState<number|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [err,      setErr]      = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string,string> = { type:"INVESTITSIYA" };
      if (status !== "Barcha holatlar") params.status = status;
      if (search.trim()) params.search = search.trim();
      setItems(await getProjects(params));
    } catch { setItems([]); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(); }, [status, search]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { getUsers().then(setUsers).catch(()=>{}); }, []);

  const paged      = useMemo(() => items.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [items, page]);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  const openCreate = () => { setForm({...INIT}); setErr(""); setModal("create"); };
  const openEdit   = (p: Project) => {
    setEditing(p);
    setForm({
      name:p.name, description:p.description, status:p.status,
      investorName:p.investorName??"",
      allocatedMoney:p.allocatedMoney??0, spentMoney:p.spentMoney??0,
      startDate:p.startDate??"", plannedEndDate:p.plannedEndDate??"",
      region:p.region??"", district:p.district??"",
      address:p.address??p.location??"",
      latitude:p.latitude, longitude:p.longitude, ownerId:p.ownerId,
    });
    setErr(""); setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };
  const f = (k: keyof ProjectCreateDto, v: string|number) => setForm(prev => ({...prev, [k]:v}));

  const handleSave = async () => {
    if (!form.name?.trim())  { setErr("Nom kiritilishi shart"); return; }
    if (!form.ownerId)       { setErr("Mas'ul shaxsni tanlang"); return; }
    setSaving(true); setErr("");
    try {
      if (modal === "create") {
        const created = await createProject({ ...INIT, ...form, type:"INVESTITSIYA" } as ProjectCreateDto);
        setItems(prev => [created, ...prev]);
      } else if (editing) {
        const updated = await updateProject(editing.id, form);
        setItems(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
      closeModal();
    } catch { setErr("Saqlashda xato yuz berdi"); }
    finally  { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await deleteProject(delId);
      setItems(prev => prev.filter(p => p.id !== delId));
      setDelId(null);
    } catch { /* ignore */ }
    finally  { setDeleting(false); }
  };

  const selectedUser = users.find(u => u.id === form.ownerId);

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight:"calc(100vh - 60px)", background:"#faf7f0" }}>

      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 flex items-start justify-between"
        style={{ background:"#fff", borderBottom:`1px solid ${CDD}`, boxShadow:`0 1px 0 ${CDD}` }}>
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-1.5"
            style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8" }}>
            INVESTITSIYA OBYEKTLARI
          </span>
          <h1 className="text-lg font-bold" style={{ color:N }}>Investitsiya Obyektlari</h1>
          <p className="text-[11px] mt-0.5" style={{ color:T2 }}>Barcha investitsiya loyihalari</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-1 transition-all"
          style={{ background:N }}
          onMouseEnter={e=>(e.currentTarget.style.opacity="0.85")}
          onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yangi obyekt
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-2 flex-shrink-0">
        <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}} className={selBase} style={selStyle}>
          {["Barcha holatlar",...STATUSES].map(v=>(
            <option key={v} value={v}>{v==="Barcha holatlar"?v:fallback(v).label}</option>
          ))}
        </select>
        <div className="relative flex-1 max-w-[260px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke={T3} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            placeholder="Qidirish..." className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all"
            style={{ background:"#fff", border:`1.5px solid ${CDD}`, color:N }}
            onFocus={e=>{e.target.style.borderColor=N; e.target.style.boxShadow=`0 0 0 3px ${N}10`;}}
            onBlur={e=>{e.target.style.borderColor=CDD; e.target.style.boxShadow="none";}} />
        </div>
        <span className="ml-auto text-xs font-medium" style={{ color:T2 }}>
          {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, items.length)} / {items.length}
        </span>
      </div>

      {/* Table */}
      <div className="px-6 pb-6 flex-1">
        <div className="rounded-2xl overflow-hidden"
          style={{ background:"#fff", border:`1px solid ${CDD}`, boxShadow:`0 1px 3px ${N}08` }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background:"#faf7f0" }}>
                {["#","NOMI / INVESTOR","JOYLASHUV","MABLAG'","HOLAT","AMALLAR"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest"
                    style={{ color:T2, borderBottom:`1.5px solid ${CDD}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${CD}` }}>
                    {[...Array(6)].map((_,j)=>(
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 rounded-lg animate-pulse" style={{ background:CD, width:j===1?"140px":"80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr><td colSpan={6} className="py-14 text-center">
                  <p className="text-sm font-medium" style={{ color:T2 }}>Ma&apos;lumot topilmadi</p>
                </td></tr>
              ) : paged.map((o,i)=>{
                const h = fallback(o.status);
                const loc = o.location ?? ([o.district, o.region].filter(Boolean).join(", ") || "—");
                return (
                  <tr key={o.id} className="transition-colors cursor-pointer"
                    style={{ borderBottom:`1px solid ${CD}` }}
                    onMouseEnter={e=>(e.currentTarget.style.background=CD)}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                    onClick={()=>router.push(`/investitsiya/obyektlar/${o.id}`)}>
                    <td className="px-4 py-3.5 text-xs font-mono font-medium" style={{ color:T3 }}>
                      {String((page-1)*PAGE_SIZE+i+1).padStart(2,"0")}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold" style={{ color:N }}>{o.name}</p>
                      {o.investorName && (
                        <p className="text-xs mt-0.5" style={{ color:T2 }}>🏢 {o.investorName}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium" style={{ color:T2 }}>{loc}</td>
                    <td className="px-4 py-3.5">
                      {o.allocatedMoney ? (
                        <div>
                          <p className="text-xs font-semibold" style={{ color:N }}>{fmtMoney(o.allocatedMoney)}</p>
                          {o.spentMoney != null && o.spentMoney > 0 && (
                            <p className="text-[10px] mt-0.5" style={{ color:T2 }}>Sarflandi: {fmtMoney(o.spentMoney)}</p>
                          )}
                        </div>
                      ) : <span style={{ color:T3 }}>—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={{ background:h.bg, color:h.color, border:`1px solid ${h.border}` }}>
                        {h.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={e=>{e.stopPropagation();router.push(`/investitsiya/obyektlar/${o.id}`);}}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                          style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }}
                          onMouseEnter={e=>(e.currentTarget.style.background="#dcfce7")}
                          onMouseLeave={e=>(e.currentTarget.style.background="#f0fdf4")}>
                          Batafsil
                        </button>
                        {!isHokim && (
                          <button onClick={e=>{e.stopPropagation();openEdit(o);}}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{ background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe" }}
                            onMouseEnter={e=>(e.currentTarget.style.background="#dbeafe")}
                            onMouseLeave={e=>(e.currentTarget.style.background="#eff6ff")}>
                            Tahrir
                          </button>
                        )}
                        {!isHokim && (
                          <button onClick={e=>{e.stopPropagation();setDelId(o.id);}}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}
                            onMouseEnter={e=>(e.currentTarget.style.background="#fee2e2")}
                            onMouseLeave={e=>(e.currentTarget.style.background="#fef2f2")}>
                            O&apos;chirish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 mt-4">
            {Array.from({length:Math.min(totalPages,9)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background:page===p?N:"#fff",
                  color:page===p?"#fff":T2,
                  border:page===p?`1px solid ${N}`:`1px solid ${CDD}`,
                }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:`rgba(13,31,60,0.4)`, backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[580px] rounded-2xl overflow-hidden"
            style={{ background:"#fff", border:`1px solid ${CDD}`, boxShadow:`0 20px 60px rgba(13,31,60,0.15)` }}>
            <div style={{ height:3, background:`linear-gradient(90deg, ${N} 0%, ${G} 100%)` }} />

            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${CDD}` }}>
              <h2 className="text-base font-bold" style={{ color:N }}>
                {modal==="create" ? "Yangi investitsiya obyekti" : "Obyektni tahrirlash"}
              </h2>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background:CD, color:T2 }}
                onMouseEnter={e=>(e.currentTarget.style.background=CDD)}
                onMouseLeave={e=>(e.currentTarget.style.background=CD)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>NOMI *</label>
                <input value={form.name??""} onChange={e=>f("name",e.target.value)}
                  placeholder="Loyiha nomi" className={inpClass} style={inpStyle}
                  onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>TAVSIF</label>
                <textarea value={form.description??""} onChange={e=>f("description",e.target.value)}
                  placeholder="Qisqacha tavsif" rows={2} className={`${inpClass} resize-none`} style={inpStyle}
                  onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>MAS&apos;UL SHAXS (OWNER) *</label>
                <div className="relative">
                  <select value={form.ownerId??0} onChange={e=>f("ownerId", parseInt(e.target.value))}
                    className={`${inpClass} cursor-pointer appearance-none pr-8`} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}}>
                    <option value={0}>— Foydalanuvchi tanlang —</option>
                    {users.map(u=>(
                      <option key={u.id} value={u.id}>{u.fullName} (@{u.username}) — {u.role}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T2} strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {selectedUser && (
                  <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background:"#dbeafe", color:"#1d4ed8" }}>
                      {selectedUser.fullName[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium" style={{ color:"#1d4ed8" }}>
                      {selectedUser.fullName} · ID: {selectedUser.id}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>INVESTOR NOMI</label>
                <input value={form.investorName??""} onChange={e=>f("investorName",e.target.value)}
                  placeholder="Masalan: China Invest Group" className={inpClass} style={inpStyle}
                  onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>HOLAT</label>
                <select value={form.status??"YANGI"} onChange={e=>f("status",e.target.value)}
                  className={`${inpClass} cursor-pointer appearance-none`} style={inpStyle}
                  onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}}>
                  {STATUSES.map(s=><option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>AJRATILGAN MABLAG&apos; (so&apos;m)</label>
                  <input type="number" min={0} value={form.allocatedMoney??""} onChange={e=>f("allocatedMoney",parseFloat(e.target.value)||0)}
                    placeholder="1000000" className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>SARFLANGAN MABLAG&apos; (so&apos;m)</label>
                  <input type="number" min={0} value={form.spentMoney??""} onChange={e=>f("spentMoney",parseFloat(e.target.value)||0)}
                    placeholder="200000" className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>BOSHLANISH SANASI</label>
                  <input type="date" value={form.startDate??""} onChange={e=>f("startDate",e.target.value)}
                    className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>TUGASH SANASI (REJA)</label>
                  <input type="date" value={form.plannedEndDate??""} onChange={e=>f("plannedEndDate",e.target.value)}
                    className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>VILOYAT</label>
                  <input value={form.region??""} onChange={e=>f("region",e.target.value)} placeholder="Toshkent"
                    className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>TUMAN</label>
                  <input value={form.district??""} onChange={e=>f("district",e.target.value)} placeholder="Chilonzor"
                    className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>MANZIL</label>
                <input value={form.address??""} onChange={e=>f("address",e.target.value)} placeholder="Ko'cha, uy raqami"
                  className={inpClass} style={inpStyle}
                  onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>KENGLIK (LAT)</label>
                  <input type="number" step="any" value={form.latitude??""} onChange={e=>f("latitude",parseFloat(e.target.value)||0)}
                    placeholder="41.2995" className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:T2 }}>UZUNLIK (LNG)</label>
                  <input type="number" step="any" value={form.longitude??""} onChange={e=>f("longitude",parseFloat(e.target.value)||0)}
                    placeholder="69.2401" className={inpClass} style={inpStyle}
                    onFocus={e=>{e.target.style.borderColor=N;}} onBlur={e=>{e.target.style.borderColor=CDD;}} />
                </div>
              </div>

              {err && (
                <p className="text-xs font-medium px-3 py-2.5 rounded-xl"
                  style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                  {err}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop:`1px solid ${CDD}` }}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background:CD, color:T2, border:`1px solid ${CDD}` }}
                onMouseEnter={e=>(e.currentTarget.style.background=CDD)}
                onMouseLeave={e=>(e.currentTarget.style.background=CD)}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background:saving?`${N}99`:N, opacity:saving?0.8:1 }}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor:"rgba(255,255,255,0.3)", borderTopColor:"#fff" }} />}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:`rgba(13,31,60,0.4)`, backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden"
            style={{ background:"#fff", border:"1px solid #fecaca", boxShadow:`0 20px 60px rgba(13,31,60,0.15)` }}>
            <div style={{ height:3, background:"linear-gradient(90deg, #dc2626, #ef4444)" }} />
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background:"#fef2f2", border:"1px solid #fecaca" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-center mb-2" style={{ color:N }}>O&apos;chirishni tasdiqlang</h3>
              <p className="text-sm text-center mb-6" style={{ color:T2 }}>
                Bu obyekt va unga bog&apos;liq ma&apos;lumotlar o&apos;chib ketadi.
              </p>
              <div className="flex gap-3">
                <button onClick={()=>setDelId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background:CD, color:T2, border:`1px solid ${CDD}` }}
                  onMouseEnter={e=>(e.currentTarget.style.background=CDD)}
                  onMouseLeave={e=>(e.currentTarget.style.background=CD)}>
                  Bekor qilish
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background:deleting?"#ef444499":"#dc2626" }}>
                  {deleting ? "O&apos;chirilmoqda..." : "O&apos;chirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
