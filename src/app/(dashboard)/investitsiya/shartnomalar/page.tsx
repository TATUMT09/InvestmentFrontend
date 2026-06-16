"use client";
import { useState, useEffect, useMemo } from "react";
import { getProjects } from "@/services/projectService";
import { getContracts, createContract, updateContract, deleteContract } from "@/services/contractService";
import type { Contract, ContractCreateDto, ContractUpdateDto, Project } from "@/types/api.types";

const STATUS_CFG: Record<string,{label:string;color:string;bg:string}> = {
  AMALDA:   { label:"Amalda",   color:"#10b981", bg:"rgba(16,185,129,0.15)"  },
  KECHIKKAN:{ label:"Kechikkan",color:"#ef4444", bg:"rgba(239,68,68,0.15)"   },
  TUGAGAN:  { label:"Tugagan",  color:"#64748b", bg:"rgba(100,116,139,0.15)" },
  BEKOR:    { label:"Bekor",    color:"#f59e0b", bg:"rgba(245,158,11,0.15)"  },
};
const fallback = (s?:string) => s
  ? (STATUS_CFG[s] ?? { label:s, color:"#64748b", bg:"rgba(100,116,139,0.15)" })
  : { label:"—", color:"#64748b", bg:"rgba(100,116,139,0.1)" };

function fmt(n:number):string {
  if (n>=1_000_000_000) return `${(n/1_000_000_000).toFixed(1)} mlrd so'm`;
  if (n>=1_000_000)     return `${(n/1_000_000).toFixed(0)} mln so'm`;
  return `${n.toLocaleString()} so'm`;
}

const inp  = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inpS = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(220,235,255,0.9)" };
const sel  = "px-3 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer appearance-none";
const selS = { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,220,255,0.85)" };

const INIT_FORM: Partial<ContractCreateDto> = {
  projectId:0, contractNumber:"", amount:0, contractDate:"", description:"",
};

export default function InvestShartnomalarnPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [projects,  setProjects]  = useState<Project[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("Barcha holatlar");

  const [modal,    setModal]    = useState<"create"|"edit"|null>(null);
  const [editing,  setEditing]  = useState<Contract|null>(null);
  const [form,     setForm]     = useState<Partial<ContractCreateDto>>(INIT_FORM);
  const [saving,   setSaving]   = useState(false);
  const [delId,    setDelId]    = useState<number|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [err,      setErr]      = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [all, projs] = await Promise.all([
          getContracts(),
          getProjects({ type:"INVESTITSIYA" }),
        ]);
        setProjects(projs);
        const investIds = new Set(projs.map(p=>p.id));
        setContracts(all.filter(c => investIds.has(c.projectId)));
      } catch { setContracts([]); }
      finally  { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => contracts.filter(c => {
    const hs = status === "Barcha holatlar" || (c.status??"") === status;
    const ss = !search
      || c.contractNumber.toLowerCase().includes(search.toLowerCase())
      || (c.project?.name??"").toLowerCase().includes(search.toLowerCase());
    return hs && ss;
  }), [contracts, status, search]);

  const f = (k: keyof ContractCreateDto, v: string|number) =>
    setForm(prev => ({...prev, [k]:v}));

  const openCreate = () => {
    setForm({...INIT_FORM, projectId: projects[0]?.id ?? 0});
    setErr(""); setModal("create");
  };
  const openEdit = (c: Contract) => {
    setEditing(c);
    setForm({ projectId:c.projectId, contractNumber:c.contractNumber,
      amount:c.amount, contractDate:c.contractDate, description:c.description });
    setErr(""); setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    if (!form.contractNumber?.trim()) { setErr("Shartnoma raqami kiritilishi shart"); return; }
    if (!form.projectId) { setErr("Loyiha tanlanishi shart"); return; }
    setSaving(true); setErr("");
    try {
      if (modal === "create") {
        const created = await createContract(form as ContractCreateDto);
        setContracts(prev => [created, ...prev]);
      } else if (editing) {
        const dto: ContractUpdateDto = {
          contractNumber: form.contractNumber,
          amount:         form.amount,
          contractDate:   form.contractDate,
          description:    form.description,
        };
        const updated = await updateContract(editing.id, dto);
        setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
      }
      closeModal();
    } catch { setErr("Saqlashda xato yuz berdi"); }
    finally  { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await deleteContract(delId);
      setContracts(prev => prev.filter(c => c.id !== delId));
      setDelId(null);
    } catch { /* ignore */ }
    finally  { setDeleting(false); }
  };

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight:"calc(100vh - 60px)", background:"#080d1a" }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-2"
            style={{ background:"rgba(16,185,129,0.18)", border:"1px solid rgba(16,185,129,0.3)", color:"#34d399" }}>
            03 SHARTNOMALAR
          </span>
          <h1 className="text-xl font-bold" style={{ color:"rgba(220,235,255,0.97)" }}>Investitsiya Shartnomalari</h1>
          <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.55)" }}>Investitsiya loyihalari shartnomalari</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-1"
          style={{ background:"#2563eb", boxShadow:"0 2px 12px rgba(37,99,235,0.4)" }}
          onMouseEnter={e=>(e.currentTarget.style.background="#1d4ed8")}
          onMouseLeave={e=>(e.currentTarget.style.background="#2563eb")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yangi shartnoma
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 pb-4 flex items-center gap-2 flex-shrink-0">
        <select value={status} onChange={e=>setStatus(e.target.value)} className={sel} style={selS}>
          {["Barcha holatlar","AMALDA","KECHIKKAN","TUGAGAN","BEKOR"].map(v=>(
            <option key={v} value={v} style={{background:"#111827"}}>{v==="Barcha holatlar"?v:fallback(v).label}</option>
          ))}
        </select>
        <div className="relative flex-1 max-w-[240px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,130,200,0.5)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none" style={selS} />
        </div>
        <span className="ml-auto text-xs" style={{color:"rgba(100,130,200,0.5)"}}>Jami: {filtered.length}</span>
      </div>

      {/* Table */}
      <div className="px-6 flex-1">
        <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.07)"}}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{background:"rgba(255,255,255,0.04)"}}>
                {["#","SHARTNOMA RAQAMI","LOYIHA","SANA","SUMMA","HOLAT","AMALLAR"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest"
                    style={{color:"rgba(100,130,200,0.5)", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_,i)=>(
                  <tr key={i}>{[...Array(7)].map((_,j)=>(
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 rounded animate-pulse" style={{background:"rgba(255,255,255,0.06)", width:j===1?"120px":"70px"}} />
                    </td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm" style={{color:"rgba(100,130,200,0.4)"}}>
                  Ma&apos;lumot topilmadi
                </td></tr>
              ) : filtered.map((c,i)=>{
                const h = fallback(c.status);
                return (
                  <tr key={c.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <td className="px-4 py-3.5 text-xs font-mono" style={{color:"rgba(100,130,200,0.5)"}}>{String(i+1).padStart(2,"0")}</td>
                    <td className="px-4 py-3.5 text-xs font-mono font-semibold" style={{color:"#60a5fa"}}>{c.contractNumber}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold" style={{color:"rgba(220,235,255,0.92)"}}>
                      {c.project?.name ?? `Loyiha #${c.projectId}`}
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{color:"rgba(160,185,230,0.7)"}}>{c.contractDate}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{color:"rgba(220,235,255,0.8)"}}>{fmt(c.amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{background:h.bg, color:h.color}}>{h.label}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>openEdit(c)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                          style={{background:"rgba(59,130,246,0.15)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.25)"}}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
                          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
                          Tahrir
                        </button>
                        <button onClick={()=>setDelId(c.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                          style={{background:"rgba(239,68,68,0.12)", color:"#f87171", border:"1px solid rgba(239,68,68,0.2)"}}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.25)")}
                          onMouseLeave={e=>(e.currentTarget.style.background="rgba(239,68,68,0.12)")}>
                          O&apos;chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)"}}>
          <div className="w-full max-w-[480px] rounded-2xl overflow-hidden"
            style={{background:"#0d1528", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              <h2 className="text-base font-bold" style={{color:"rgba(220,235,255,0.97)"}}>
                {modal==="create" ? "Yangi shartnoma" : "Shartnomani tahrirlash"}
              </h2>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{background:"rgba(255,255,255,0.05)", color:"rgba(150,175,220,0.6)"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{color:"rgba(130,165,220,0.6)"}}>LOYIHA *</label>
                <select value={form.projectId??0} onChange={e=>f("projectId",parseInt(e.target.value))}
                  disabled={modal==="edit"} className={`${inp} cursor-pointer appearance-none`} style={inpS}>
                  <option value={0} style={{background:"#111827"}}>— Loyiha tanlang —</option>
                  {projects.map(p=>(
                    <option key={p.id} value={p.id} style={{background:"#111827"}}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{color:"rgba(130,165,220,0.6)"}}>SHARTNOMA RAQAMI *</label>
                <input value={form.contractNumber??""} onChange={e=>f("contractNumber",e.target.value)}
                  placeholder="SH-2025-001" className={inp} style={inpS} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{color:"rgba(130,165,220,0.6)"}}>SUMMA (SO&apos;M)</label>
                <input type="number" value={form.amount??""} onChange={e=>f("amount",parseFloat(e.target.value)||0)}
                  placeholder="1000000000" className={inp} style={inpS} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{color:"rgba(130,165,220,0.6)"}}>SANA</label>
                <input type="date" value={form.contractDate??""} onChange={e=>f("contractDate",e.target.value)}
                  className={inp} style={inpS} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{color:"rgba(130,165,220,0.6)"}}>TAVSIF</label>
                <textarea value={form.description??""} onChange={e=>f("description",e.target.value)}
                  placeholder="Shartnoma haqida ma'lumot" rows={2}
                  className={`${inp} resize-none`} style={inpS} />
              </div>
              {err && (
                <p className="text-xs px-3 py-2.5 rounded-xl" style={{background:"rgba(239,68,68,0.1)", color:"#f87171", border:"1px solid rgba(239,68,68,0.2)"}}>
                  {err}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{background:"rgba(255,255,255,0.05)", color:"rgba(150,175,220,0.7)", border:"1px solid rgba(255,255,255,0.09)"}}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{background:saving?"rgba(37,99,235,0.5)":"#2563eb", opacity:saving?0.7:1}}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:"rgba(255,255,255,0.2)", borderTopColor:"#fff"}} />}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)"}}>
          <div className="w-full max-w-[360px] rounded-2xl p-6"
            style={{background:"#0d1528", border:"1px solid rgba(239,68,68,0.3)", boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.25)"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-center mb-2" style={{color:"rgba(220,235,255,0.97)"}}>O&apos;chirishni tasdiqlang</h3>
            <p className="text-sm text-center mb-6" style={{color:"rgba(120,150,200,0.6)"}}>Bu shartnoma butunlay o&apos;chib ketadi.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{background:"rgba(255,255,255,0.05)", color:"rgba(150,175,220,0.7)", border:"1px solid rgba(255,255,255,0.09)"}}>
                Bekor qilish
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{background:deleting?"rgba(239,68,68,0.4)":"#dc2626", color:"#fff"}}>
                {deleting ? "O&apos;chirilmoqda..." : "O&apos;chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
