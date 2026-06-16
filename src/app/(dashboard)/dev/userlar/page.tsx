"use client";
import { useState, useEffect, useMemo } from "react";
import { getUsers, createUser, updateUser } from "@/services/userService";
import type { ApiUser, UserCreateDto } from "@/types/api.types";

const ROLES = ["TADBIRKOR","INVESTITSIYA","QURILISH","TASHKILOT","HOKIM","DEV"] as const;

const ROLE_CFG: Record<string, { label:string; color:string; bg:string }> = {
  TADBIRKOR:    { label:"Tadbirkor",    color:"#f59e0b", bg:"rgba(245,158,11,0.12)" },
  INVESTITSIYA: { label:"Investitsiya", color:"#60a5fa", bg:"rgba(59,130,246,0.12)" },
  QURILISH:     { label:"Qurilish",     color:"#a78bfa", bg:"rgba(139,92,246,0.12)" },
  TASHKILOT:    { label:"Tashkilot",    color:"#34d399", bg:"rgba(16,185,129,0.12)" },
  HOKIM:        { label:"Hokim",        color:"#f472b6", bg:"rgba(244,114,182,0.12)" },
  DEV:          { label:"Dev",          color:"#06b6d4", bg:"rgba(6,182,212,0.12)" },
};
const rcfg = (r: string) => ROLE_CFG[r] ?? { label:r, color:"#94a3b8", bg:"rgba(148,163,184,0.12)" };

const DEPARTMENTS = [
  "INVESTITSIYA","QURILISH","ELEKTR","SUV","GAZ","YOL","HUJJAT","MOLIYA","INTERNET","BOSHQA",
];
const PROBLEM_TYPES = ["ELEKTR","SUV","GAZ","YOL","HUJJAT","MOLIYA","INTERNET","BOSHQA"];

const PAGE_SIZE = 15;
const EMPTY: UserCreateDto = { fullName:"", phone:"", username:"", password:"", role:"TADBIRKOR", department:"", organizationType:"" };

const inp  = "w-full text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all";
const inpS = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" };

type ModalType = "create" | "edit" | "password" | null;

export default function DevUserlarPage() {
  const [items,    setItems]    = useState<ApiUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [roleF,    setRoleF]    = useState("barchasi");
  const [page,     setPage]     = useState(1);

  const [modal,    setModal]    = useState<ModalType>(null);
  const [editing,  setEditing]  = useState<ApiUser|null>(null);
  const [form,     setForm]     = useState<UserCreateDto>(EMPTY);
  const [newPass,  setNewPass]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState("");
  const [success,  setSuccess]  = useState("");

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

  const clean = (dto: UserCreateDto) => ({
    ...dto,
    department:       dto.department?.trim()       || undefined,
    organizationType: dto.organizationType?.trim() || undefined,
  });

  const openCreate = () => { setForm({ ...EMPTY }); setErr(""); setSuccess(""); setModal("create"); };
  const openEdit   = (u: ApiUser) => {
    setEditing(u);
    setForm({ fullName:u.fullName, phone:u.phone||"", username:u.username, password:"", role:u.role, department:u.department??"", organizationType:u.organizationType??"" });
    setErr(""); setSuccess(""); setModal("edit");
  };
  const openPass = (u: ApiUser) => { setEditing(u); setNewPass(""); setErr(""); setSuccess(""); setModal("password"); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setErr("To'liq ism kiritilishi shart"); return; }
    if (!form.username.trim()) { setErr("Foydalanuvchi nomi kiritilishi shart"); return; }
    if (modal === "create" && !form.password.trim()) { setErr("Parol kiritilishi shart"); return; }
    setSaving(true); setErr("");
    try {
      if (modal === "create") {
        const created = await createUser(clean(form));
        setItems(p => [created, ...p]);
        setSuccess("Foydalanuvchi muvaffaqiyatli yaratildi!");
        setTimeout(closeModal, 1200);
      } else if (editing) {
        const pwd = form.password.trim() ? form.password : "";
        const updated = await updateUser(editing.id, { ...clean({ ...form, password: pwd }), active: editing.active });
        setItems(p => p.map(u => u.id === updated.id ? updated : u));
        setSuccess("Ma'lumotlar yangilandi!");
        setTimeout(closeModal, 1000);
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg || "Saqlashda xato yuz berdi");
    } finally { setSaving(false); }
  };

  const handlePasswordReset = async () => {
    if (!newPass.trim() || newPass.length < 4) { setErr("Parol kamida 4 ta belgi bo'lishi kerak"); return; }
    if (!editing) return;
    setSaving(true); setErr("");
    try {
      const updated = await updateUser(editing.id, {
        fullName: editing.fullName,
        phone:    editing.phone || "",
        username: editing.username,
        password: newPass,
        role:     editing.role,
        active:   editing.active,
        department:       editing.department       || undefined,
        organizationType: editing.organizationType || undefined,
      });
      setItems(p => p.map(u => u.id === updated.id ? updated : u));
      setSuccess("Parol muvaffaqiyatli tiklandi!");
      setTimeout(closeModal, 1200);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg || "Parolni tiklashda xato");
    } finally { setSaving(false); }
  };

  const counts: Record<string,number> = { barchasi: items.length };
  items.forEach(u => { counts[u.role] = (counts[u.role]||0)+1; });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color:"rgba(220,235,255,0.95)" }}>
            Userlar boshqaruvi
          </h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
            Barcha foydalanuvchilar — ko'rish, tahrirlash, parol tiklash
          </p>
        </div>
        <button onClick={openCreate}
          className="text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
          style={{ background:"rgba(6,182,212,0.15)", border:"1px solid rgba(6,182,212,0.35)", color:"#06b6d4" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(6,182,212,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(6,182,212,0.15)")}>
          <span className="text-base">+</span> Yangi user
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { key:"barchasi",    label:"Jami",         color:"#06b6d4" },
          { key:"TADBIRKOR",   label:"Tadbirkor",    color:"#f59e0b" },
          { key:"INVESTITSIYA",label:"Investitsiya", color:"#60a5fa" },
          { key:"QURILISH",    label:"Qurilish",     color:"#a78bfa" },
          { key:"TASHKILOT",   label:"Tashkilot",    color:"#34d399" },
          { key:"HOKIM",       label:"Hokim",        color:"#f472b6" },
          { key:"DEV",         label:"Dev",          color:"#06b6d4" },
        ].map(s => (
          <button key={s.key} onClick={() => { setRoleF(s.key); setPage(1); }}
            className="px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all text-xs"
            style={{
              background: roleF===s.key ? `${s.color}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${roleF===s.key ? `${s.color}40` : "rgba(255,255,255,0.07)"}`,
            }}>
            <span className="font-bold text-sm" style={{ color:s.color }}>{loading ? "…" : counts[s.key]||0}</span>
            <span style={{ color:"rgba(120,150,200,0.6)" }}>{s.label}</span>
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
            onFocus={e=>{e.target.style.borderColor="rgba(6,182,212,0.4)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
          />
        </div>
        <span className="ml-auto text-xs self-center" style={{ color:"rgba(100,130,200,0.45)" }}>
          {filtered.length > 0
            ? `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,filtered.length)} / ${filtered.length}`
            : "0 ta"}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#","FOYDALANUVCHI","TELEFON","ROL","HOLAT","AMALLAR"].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(8)].map((_,i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  {[...Array(6)].map((_,j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 rounded animate-pulse"
                        style={{ background:"rgba(255,255,255,0.06)", width:j===1?"140px":"80px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
                  {search ? "Topilmadi" : "Foydalanuvchilar yo'q"}
                </p>
              </td></tr>
            ) : paged.map((u, i) => {
              const rc = rcfg(u.role);
              return (
                <tr key={u.id}
                  style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background:i%2===0?"rgba(255,255,255,0.01)":"transparent" }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:"rgba(100,130,200,0.5)" }}>
                    {String((page-1)*PAGE_SIZE+i+1).padStart(2,"0")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background:rc.bg, color:rc.color }}>
                        {u.fullName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color:"rgba(200,220,255,0.9)" }}>{u.fullName}</p>
                        <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:"rgba(150,180,230,0.6)" }}>
                    {u.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:rc.bg, color:rc.color }}>
                      {rc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={u.active
                        ? { background:"rgba(16,185,129,0.12)", color:"#34d399" }
                        : { background:"rgba(244,63,94,0.1)",   color:"#fb7185" }}>
                      {u.active ? "Faol" : "Blok"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={()=>openEdit(u)}
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ background:"rgba(59,130,246,0.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.2)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.1)")}>
                        Tahrir
                      </button>
                      <button onClick={()=>openPass(u)}
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ background:"rgba(245,158,11,0.1)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.2)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.2)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(245,158,11,0.1)")}>
                        🔑 Parol
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
          {Array.from({ length: Math.min(totalPages, 10) }, (_,i) => i+1).map(p => (
            <button key={p} onClick={()=>setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: page===p ? "rgba(6,182,212,0.2)"  : "rgba(255,255,255,0.04)",
                color:      page===p ? "#06b6d4"               : "rgba(130,160,210,0.6)",
                border:     page===p ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.07)",
              }}>{p}</button>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[480px] rounded-2xl overflow-hidden"
            style={{ background:"#0d1528", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 24px 64px rgba(0,0,0,0.6)" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#06b6d4,#3b82f6)" }} />
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-bold text-base" style={{ color:"rgba(220,235,255,0.95)" }}>
                {modal==="create" ? "Yangi foydalanuvchi" : "Foydalanuvchini tahrirlash"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:"rgba(255,255,255,0.06)", color:"rgba(150,180,230,0.6)" }}>
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
                  onFocus={e=>{e.target.style.borderColor="rgba(6,182,212,0.5)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>TELEFON</label>
                <input value={form.phone} onChange={e=>f("phone",e.target.value)}
                  placeholder="+998901234567" className={inp} style={inpS}
                  onFocus={e=>{e.target.style.borderColor="rgba(6,182,212,0.5)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>USERNAME *</label>
                  <input value={form.username} onChange={e=>f("username",e.target.value)}
                    placeholder="username" className={inp} style={inpS}
                    onFocus={e=>{e.target.style.borderColor="rgba(6,182,212,0.5)";}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>
                    {modal==="edit" ? "PAROL (ixtiyoriy)" : "PAROL *"}
                  </label>
                  <input type="password" value={form.password} onChange={e=>f("password",e.target.value)}
                    placeholder={modal==="edit" ? "O'zgartirish uchun kiriting" : "Parol"}
                    className={inp} style={inpS}
                    onFocus={e=>{e.target.style.borderColor="rgba(6,182,212,0.5)";}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>ROL</label>
                <select value={form.role}
                  onChange={e=>{ f("role",e.target.value); if (e.target.value!=="TASHKILOT") f("organizationType",""); }}
                  className={`${inp} cursor-pointer appearance-none`} style={inpS}>
                  {ROLES.map(r => <option key={r} value={r} style={{ background:"#0d1528" }}>{rcfg(r).label}</option>)}
                </select>
              </div>
              {form.role === "TASHKILOT" && (
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>TASHKILOT TURI *</label>
                  <select value={form.organizationType??""} onChange={e=>f("organizationType",e.target.value)}
                    className={`${inp} cursor-pointer appearance-none`} style={inpS}>
                    <option value="" style={{ background:"#0d1528" }}>— Tanlang —</option>
                    {PROBLEM_TYPES.map(d => <option key={d} value={d} style={{ background:"#0d1528" }}>{d}</option>)}
                  </select>
                </div>
              )}
              {form.role === "INVESTITSIYA" && (
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>BO&apos;LIM</label>
                  <select value={form.department??""} onChange={e=>f("department",e.target.value)}
                    className={`${inp} cursor-pointer appearance-none`} style={inpS}>
                    <option value="" style={{ background:"#0d1528" }}>— Tanlang —</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background:"#0d1528" }}>{d}</option>)}
                  </select>
                </div>
              )}
              {modal === "edit" && editing && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs" style={{ color:"rgba(150,180,230,0.6)" }}>Joriy holat:</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={editing.active
                      ? { background:"rgba(16,185,129,0.12)", color:"#34d399" }
                      : { background:"rgba(244,63,94,0.1)",   color:"#fb7185" }}>
                    {editing.active ? "Faol" : "Bloklangan"}
                  </span>
                </div>
              )}
              {err && (
                <p className="text-xs px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(244,63,94,0.1)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
                  {err}
                </p>
              )}
              {success && (
                <p className="text-xs px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.2)" }}>
                  {success}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background:"rgba(6,182,212,0.15)", border:"1px solid rgba(6,182,212,0.4)", color:"#06b6d4", opacity:saving?0.7:1 }}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor:"rgba(6,182,212,0.3)", borderTopColor:"#06b6d4" }} />}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {modal === "password" && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}>
          <div className="w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{ background:"#0d1528", border:"1px solid rgba(245,158,11,0.25)", boxShadow:"0 24px 64px rgba(0,0,0,0.6)" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#f59e0b,#f97316)" }} />
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <h2 className="font-bold text-base" style={{ color:"rgba(220,235,255,0.95)" }}>Parol tiklash</h2>
                <p className="text-xs mt-0.5" style={{ color:"rgba(120,150,200,0.55)" }}>
                  @{editing.username} — {editing.fullName}
                </p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:"rgba(255,255,255,0.06)", color:"rgba(150,180,230,0.6)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)" }}>
                <span className="text-lg">⚠️</span>
                <p className="text-xs" style={{ color:"rgba(251,191,36,0.8)" }}>
                  Foydalanuvchi eski parolini bilishi shart emas. Yangi parol darhol kuchga kiradi.
                </p>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color:"rgba(100,130,200,0.6)" }}>
                  YANGI PAROL *
                </label>
                <input
                  type="text"
                  value={newPass}
                  onChange={e=>setNewPass(e.target.value)}
                  placeholder="Yangi parolni kiriting"
                  className={inp} style={inpS}
                  onFocus={e=>{e.target.style.borderColor="rgba(245,158,11,0.5)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
                />
                <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.4)" }}>
                  Kamida 4 ta belgi
                </p>
              </div>
              {err && (
                <p className="text-xs px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(244,63,94,0.1)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
                  {err}
                </p>
              )}
              {success && (
                <p className="text-xs px-3 py-2.5 rounded-xl"
                  style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.2)" }}>
                  {success}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}>
                Bekor qilish
              </button>
              <button onClick={handlePasswordReset} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.4)", color:"#fbbf24", opacity:saving?0.7:1 }}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor:"rgba(251,191,36,0.3)", borderTopColor:"#fbbf24" }} />}
                {saving ? "Tiklanmoqda..." : "🔑 Parolni tiklash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
