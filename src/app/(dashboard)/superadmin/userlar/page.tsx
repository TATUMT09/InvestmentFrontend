"use client";
import { useState, useEffect, useMemo } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/userService";
import type { ApiUser, UserCreateDto } from "@/types/api.types";

const ROLES = ["TADBIRKOR","INVESTITSIYA","QURILISH","TASHKILOT","HOKIM"] as const;
const ROLE_CFG: Record<string, { label:string; color:string; bg:string }> = {
  TADBIRKOR:    { label:"Tadbirkor",    color:"#f59e0b", bg:"rgba(245,158,11,0.12)" },
  INVESTITSIYA: { label:"Investitsiya", color:"#60a5fa", bg:"rgba(59,130,246,0.12)" },
  QURILISH:     { label:"Qurilish",     color:"#a78bfa", bg:"rgba(139,92,246,0.12)" },
  TASHKILOT:    { label:"Tashkilot",    color:"#34d399", bg:"rgba(16,185,129,0.12)" },
  HOKIM:        { label:"Hokim",        color:"#f472b6", bg:"rgba(244,114,182,0.12)" },
  DEV:          { label:"Dev",          color:"#94a3b8", bg:"rgba(148,163,184,0.12)" },
};
const rcfg = (r: string) => ROLE_CFG[r] ?? { label: r, color:"#94a3b8", bg:"rgba(148,163,184,0.12)" };

const DEPARTMENTS = [
  { value:"INVESTITSIYA", label:"Investitsiya" },
  { value:"QURILISH",     label:"Qurilish"     },
  { value:"ELEKTR",       label:"Elektr"       },
  { value:"SUV",          label:"Suv"          },
  { value:"GAZ",          label:"Gaz"          },
  { value:"YOL",          label:"Yo'l"         },
  { value:"HUJJAT",       label:"Hujjat"       },
  { value:"MOLIYA",       label:"Moliya"       },
  { value:"INTERNET",     label:"Internet"     },
  { value:"BOSHQA",       label:"Boshqa"       },
];

const PROBLEM_TYPES = [
  { value:"ELEKTR",   label:"Elektr"   },
  { value:"SUV",      label:"Suv"      },
  { value:"GAZ",      label:"Gaz"      },
  { value:"YOL",      label:"Yo'l"     },
  { value:"HUJJAT",   label:"Hujjat"   },
  { value:"MOLIYA",   label:"Moliya"   },
  { value:"INTERNET", label:"Internet" },
  { value:"BOSHQA",   label:"Boshqa"   },
];

const PAGE_SIZE = 12;
const EMPTY: UserCreateDto = { fullName:"", phone:"", username:"", password:"", role:"TADBIRKOR", department:"", organizationType:"" };

const inp = "w-full text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all";
const inpS = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" };

export default function HokimUserlarPage() {
  const [items,   setItems]   = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [roleF,   setRoleF]   = useState("barchasi");
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState<"create"|"edit"|null>(null);
  const [editing, setEditing] = useState<ApiUser|null>(null);
  const [form,    setForm]    = useState<UserCreateDto>(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");
  const [delId,   setDelId]   = useState<number|null>(null);
  const [deleting,setDeleting]= useState(false);

  const load = async () => {
    setLoading(true);
    try { setItems(await getUsers()); } catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (roleF !== "barchasi") list = list.filter(u => u.role === roleF);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.phone || "").includes(q)
      );
    }
    return list;
  }, [items, roleF, search]);

  const paged      = useMemo(() => filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [filtered, page]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const f = (k: keyof UserCreateDto, v: string) => setForm(p => ({ ...p, [k]: v }));

  const openCreate = () => { setForm({ ...EMPTY }); setErr(""); setModal("create"); };
  const openEdit   = (u: ApiUser) => {
    setEditing(u);
    setForm({ fullName:u.fullName, phone:u.phone, username:u.username, password:"", role:u.role, department:u.department??"", organizationType:u.organizationType??"" });
    setErr(""); setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setErr("To'liq ism kiritilishi shart"); return; }
    if (!form.username.trim()) { setErr("Foydalanuvchi nomi kiritilishi shart"); return; }
    if (modal === "create" && !form.password.trim()) { setErr("Parol kiritilishi shart"); return; }
    if (form.role === "TASHKILOT" && !form.organizationType) { setErr("Tashkilot turi tanlanishi shart"); return; }
    setSaving(true); setErr("");
    try {
      const cleanDto = (dto: UserCreateDto) => ({
        ...dto,
        department: dto.department?.trim() || undefined,
        organizationType: dto.organizationType?.trim() || undefined,
      });
      if (modal === "create") {
        const created = await createUser(cleanDto(form));
        setItems(p => [created, ...p]);
      } else if (editing) {
        const pwd = form.password.trim() ? form.password : "";
        const updated = await updateUser(editing.id, { ...cleanDto({ ...form, password: pwd }), active: editing.active });
        setItems(p => p.map(u => u.id === updated.id ? updated : u));
      }
      closeModal();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg || "Saqlashda xato yuz berdi");
    }
    finally  { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await deleteUser(delId);
      setItems(p => p.filter(u => u.id !== delId));
      setDelId(null);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  const counts: Record<string,number> = { barchasi: items.length };
  items.forEach(u => { counts[u.role] = (counts[u.role]||0)+1; });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:"rgba(220,235,255,0.95)" }}>Barcha foydalanuvchilar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Barcha rollar bo&apos;yicha foydalanuvchilar ro&apos;yxati</p>
        </div>
        <button onClick={openCreate}
          className="text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
          <span className="text-base">+</span> User qo&apos;shish
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { key:"barchasi",    label:"Jami",         color:"#60a5fa" },
          { key:"TADBIRKOR",   label:"Tadbirkor",    color:"#f59e0b" },
          { key:"INVESTITSIYA",label:"Investitsiya", color:"#60a5fa" },
          { key:"TASHKILOT",   label:"Tashkilot",    color:"#34d399" },
          { key:"QURILISH",    label:"Qurilish",     color:"#a78bfa" },
        ].map(s => (
          <button key={s.key} onClick={() => { setRoleF(s.key); setPage(1); }}
            className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            style={{
              background: roleF===s.key ? `${s.color}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${roleF===s.key ? `${s.color}40` : "rgba(255,255,255,0.07)"}`,
            }}>
            <span className="text-lg font-bold" style={{ color:s.color }}>{loading ? "…" : counts[s.key]||0}</span>
            <span className="text-xs" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13"
            viewBox="0 0 24 24" fill="none" stroke="rgba(100,130,200,0.4)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
            placeholder="Ism, username yoki telefon..."
            className="w-full text-sm pl-8 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.35)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
          />
        </div>
        <span className="ml-auto text-xs self-center" style={{ color:"rgba(100,130,200,0.45)" }}>
          {filtered.length > 0
            ? `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,filtered.length)} / ${filtered.length}`
            : "0"}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#","FOYDALANUVCHI","TELEFON","ROL","BO'LIM","HOLAT","AMALLAR"].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_,i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  {[...Array(7)].map((_,j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 rounded animate-pulse" style={{ background:"rgba(255,255,255,0.06)", width:j===1?"140px":"70px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
                  {search ? "Qidiruvga mos foydalanuvchi topilmadi" : "Foydalanuvchilar yo'q"}
                </p>
              </td></tr>
            ) : paged.map((u, i) => {
              const rc = rcfg(u.role);
              return (
                <tr key={u.id}
                  style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0?"rgba(255,255,255,0.01)":"transparent" }}>
                  <td className="px-4 py-3.5 text-xs font-mono" style={{ color:"rgba(100,130,200,0.5)" }}>
                    {String((page-1)*PAGE_SIZE+i+1).padStart(2,"0")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background:rc.bg, color:rc.color }}>
                        {u.fullName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{u.fullName}</p>
                        <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono" style={{ color:"rgba(150,180,230,0.6)" }}>
                    {u.phone || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:rc.bg, color:rc.color }}>
                      {rc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(150,180,230,0.55)" }}>
                    {u.organizationType || u.department || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={u.active
                        ? { background:"rgba(16,185,129,0.12)", color:"#34d399" }
                        : { background:"rgba(244,63,94,0.1)", color:"#fb7185" }}>
                      {u.active ? "Faol" : "Bloklangan"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(u)}
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ background:"rgba(59,130,246,0.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.2)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.1)")}>
                        Tahrir
                      </button>
                      <button onClick={()=>setDelId(u.id)}
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                        O&apos;chir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 mt-4">
          {Array.from({ length: Math.min(totalPages,9) }, (_,i)=>i+1).map(p => (
            <button key={p} onClick={()=>setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: page===p ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.04)",
                color:      page===p ? "#60a5fa" : "rgba(130,160,210,0.6)",
                border:     page===p ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.07)",
              }}>{p}</button>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[480px] rounded-2xl overflow-hidden"
            style={{ background:"#111e38", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 24px 64px rgba(0,0,0,0.5)" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />

            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-bold text-base" style={{ color:"rgba(220,235,255,0.95)" }}>
                {modal==="create" ? "Yangi foydalanuvchi" : "Foydalanuvchini tahrirlash"}
              </h2>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background:"rgba(255,255,255,0.06)", color:"rgba(150,180,230,0.6)" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}
                onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>TO&apos;LIQ ISM *</label>
                <input value={form.fullName} onChange={e=>f("fullName",e.target.value)}
                  placeholder="Ism Familiya" className={inp} style={inpS}
                  onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>TELEFON</label>
                <input value={form.phone} onChange={e=>f("phone",e.target.value)}
                  placeholder="+998901234567" className={inp} style={inpS}
                  onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>FOYDALANUVCHI NOMI *</label>
                  <input value={form.username} onChange={e=>f("username",e.target.value)}
                    placeholder="username" className={inp} style={inpS}
                    onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>
                    {modal==="edit" ? "PAROL (o'zgartirish)" : "PAROL *"}
                  </label>
                  <input type="password" value={form.password} onChange={e=>f("password",e.target.value)}
                    placeholder={modal==="edit" ? "Bo'sh qoldiring" : "Parol"}
                    className={inp} style={inpS}
                    onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>ROL</label>
                <select value={form.role}
                  onChange={e=>{ f("role",e.target.value); if (e.target.value!=="TASHKILOT") f("organizationType",""); }}
                  className={`${inp} cursor-pointer appearance-none`} style={inpS}>
                  {ROLES.map(r => <option key={r} value={r} style={{ background:"#111e38" }}>{rcfg(r).label}</option>)}
                </select>
              </div>
              {form.role === "TASHKILOT" && (
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>
                    TASHKILOT TURI *
                    <span className="ml-1 font-normal normal-case" style={{ color:"#f87171" }}>(majburiy)</span>
                  </label>
                  <select value={form.organizationType??""} onChange={e=>f("organizationType",e.target.value)}
                    className={`${inp} cursor-pointer appearance-none`}
                    style={{ ...inpS, border: !form.organizationType?"1px solid rgba(248,113,113,0.4)":"1px solid rgba(255,255,255,0.1)" }}>
                    <option value="" style={{ background:"#111e38" }}>— Tashkilot turini tanlang —</option>
                    {PROBLEM_TYPES.map(d => <option key={d.value} value={d.value} style={{ background:"#111e38" }}>{d.label}</option>)}
                  </select>
                </div>
              )}
              {modal === "edit" && editing && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs" style={{ color:"rgba(150,180,230,0.6)" }}>Holat:</span>
                  <button
                    onClick={() => setForm(p => ({ ...p }))}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-lg"
                    style={editing.active
                      ? { background:"rgba(16,185,129,0.12)", color:"#34d399" }
                      : { background:"rgba(244,63,94,0.1)", color:"#fb7185" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: editing.active?"#34d399":"#fb7185" }} />
                    {editing.active ? "Faol" : "Bloklangan"}
                  </button>
                </div>
              )}
              {err && (
                <p className="text-xs px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(244,63,94,0.1)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
                  {err}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
                onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background:saving?"rgba(59,130,246,0.1)":"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.4)", color:"#60a5fa", opacity:saving?0.7:1 }}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(96,165,250,0.3)", borderTopColor:"#60a5fa" }} />}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[340px] rounded-2xl overflow-hidden"
            style={{ background:"#111e38", border:"1px solid rgba(244,63,94,0.25)", boxShadow:"0 24px 64px rgba(0,0,0,0.5)" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#dc2626,#ef4444)" }} />
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
              </div>
              <p className="font-bold mb-2" style={{ color:"rgba(220,235,255,0.95)" }}>O&apos;chirishni tasdiqlang</p>
              <p className="text-sm mb-6" style={{ color:"rgba(150,180,230,0.6)" }}>Bu foydalanuvchi tizimdan o&apos;chib ketadi.</p>
              <div className="flex gap-3">
                <button onClick={()=>setDelId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
                  Bekor
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background:"rgba(244,63,94,0.15)", border:"1px solid rgba(244,63,94,0.3)", color:"#f87171", opacity:deleting?0.7:1 }}>
                  {deleting ? "..." : "O'chirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
