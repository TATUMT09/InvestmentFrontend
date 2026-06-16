"use client";
import { useState, useEffect, useMemo } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/userService";
import type { ApiUser, UserCreateDto } from "@/types/api.types";

const N="#0d1f3c", G="#c9a84c", CD="#f0ead8", CDD="#e4dbc8", T2="#8896b0", T3="#b0bdd4";
const ACCENT = "#7c3aed";

const ROLES = ["TADBIRKOR", "QURILISH", "TASHKILOT"] as const;
const ROLE_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  TADBIRKOR: { label: "Tadbirkor",  color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  QURILISH:  { label: "Qurilish",   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  TASHKILOT: { label: "Tashkilot",  color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
};
const fallback = (r: string) => ROLE_CFG[r] ?? { label: r, color: "#475569", bg: "#f8fafc", border: "#e2e8f0" };

const PAGE_SIZE = 10;
const EMPTY: UserCreateDto = { fullName: "", phone: "", username: "", password: "", role: "TADBIRKOR" };

const selBase  = "px-3 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer appearance-none";
const selStyle = { background: "#fff", border: `1.5px solid ${CDD}`, color: N };
const inpClass = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inpStyle = { background: CD, border: `1.5px solid ${CDD}`, color: N };

export default function QurilishFoydalanuvchilarPage() {
  const [items,    setItems]    = useState<ApiUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [roleF,    setRoleF]    = useState("Barchasi");
  const [page,     setPage]     = useState(1);
  const [modal,    setModal]    = useState<"create" | "edit" | null>(null);
  const [editing,  setEditing]  = useState<ApiUser | null>(null);
  const [form,     setForm]     = useState<UserCreateDto>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [delId,    setDelId]    = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [err,      setErr]      = useState("");

  const load = async () => {
    setLoading(true);
    try { setItems(await getUsers()); } catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = items.filter(u => ["TADBIRKOR", "QURILISH", "TASHKILOT"].includes(u.role));
    if (roleF !== "Barchasi") list = list.filter(u => u.role === roleF);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return list;
  }, [items, roleF, search]);

  const paged      = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const openCreate = () => { setForm({ ...EMPTY }); setErr(""); setModal("create"); };
  const openEdit   = (u: ApiUser) => {
    setEditing(u);
    setForm({ fullName: u.fullName, phone: u.phone, username: u.username, password: "", role: u.role });
    setErr(""); setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };
  const f = (k: keyof UserCreateDto, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.fullName.trim()) { setErr("To'liq ism kiritilishi shart"); return; }
    if (!form.username.trim()) { setErr("Foydalanuvchi nomi kiritilishi shart"); return; }
    if (modal === "create" && !form.password.trim()) { setErr("Parol kiritilishi shart"); return; }
    setSaving(true); setErr("");
    try {
      const clean = (dto: UserCreateDto & { active?: boolean }) => ({
        ...dto,
        department: dto.department?.trim() || undefined,
        organizationType: dto.organizationType?.trim() || undefined,
      });
      if (modal === "create") {
        const created = await createUser(clean(form));
        setItems(prev => [created, ...prev]);
      } else if (editing) {
        const base = { ...form, active: editing.active };
        if (!form.password.trim()) base.password = "";
        const updated = await updateUser(editing.id, clean(base));
        setItems(prev => prev.map(u => u.id === updated.id ? updated : u));
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
      setItems(prev => prev.filter(u => u.id !== delId));
      setDelId(null);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight: "calc(100vh - 60px)", background: "#faf7f0" }}>

      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 flex items-start justify-between"
        style={{ background: "#fff", borderBottom: `1px solid ${CDD}`, boxShadow: `0 1px 0 ${CDD}` }}>
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-1.5"
            style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", color: ACCENT }}>
            FOYDALANUVCHILAR
          </span>
          <h1 className="text-lg font-bold" style={{ color: N }}>Foydalanuvchilar</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T2 }}>Qurilish bo&apos;limi foydalanuvchilari</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-1 transition-all"
          style={{ background: ACCENT }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yangi foydalanuvchi
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-2 flex-shrink-0">
        <select value={roleF} onChange={e => { setRoleF(e.target.value); setPage(1); }} className={selBase} style={selStyle}>
          <option value="Barchasi">Barcha rollar</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_CFG[r].label}</option>)}
        </select>
        <div className="relative flex-1 max-w-[260px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke={T3} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Qidirish..." className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all"
            style={{ background: "#fff", border: `1.5px solid ${CDD}`, color: N }}
            onFocus={e => { e.target.style.borderColor = N; e.target.style.boxShadow = `0 0 0 3px ${N}10`; }}
            onBlur={e  => { e.target.style.borderColor = CDD; e.target.style.boxShadow = "none"; }} />
        </div>
        <span className="ml-auto text-xs font-medium" style={{ color: T2 }}>
          {filtered.length > 0 ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} / ${filtered.length}` : "0"}
        </span>
      </div>

      {/* Table */}
      <div className="px-6 pb-6 flex-1">
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: `1px solid ${CDD}`, boxShadow: `0 1px 3px ${N}08` }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#faf7f0" }}>
                {["#", "TO'LIQ ISM", "TELEFON", "FOYDALANUVCHI NOMI", "ROL", "HOLAT", "AMALLAR"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest"
                    style={{ color: T2, borderBottom: `1.5px solid ${CDD}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${CD}` }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 rounded-lg animate-pulse" style={{ background: CD, width: j === 1 ? "160px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr><td colSpan={7} className="py-14 text-center">
                  <p className="text-sm font-medium" style={{ color: T2 }}>Ma&apos;lumot topilmadi</p>
                </td></tr>
              ) : paged.map((u, i) => {
                const rc = fallback(u.role);
                return (
                  <tr key={u.id} className="transition-colors"
                    style={{ borderBottom: `1px solid ${CD}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = CD)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3.5 text-xs font-mono font-medium" style={{ color: T3 }}>
                      {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color }}>
                          {u.fullName[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: N }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono font-medium" style={{ color: T2 }}>{u.phone}</td>
                    <td className="px-4 py-3.5 text-xs font-medium" style={{ color: T2 }}>@{u.username}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                        {rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={u.active
                          ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                          : { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                        {u.active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                          style={{ background: "#f5f3ff", color: ACCENT, border: "1px solid #ddd6fe" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#ede9fe")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#f5f3ff")}>
                          Tahrir
                        </button>
                        <button onClick={() => setDelId(u.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}>
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

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 mt-4">
            {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: page === p ? ACCENT : "#fff",
                  color: page === p ? "#fff" : T2,
                  border: page === p ? `1px solid ${ACCENT}` : `1px solid ${CDD}`,
                }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: `rgba(13,31,60,0.4)`, backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-[500px] rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: `1px solid ${CDD}`, boxShadow: `0 20px 60px rgba(13,31,60,0.15)` }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${N} 0%, ${G} 100%)` }} />

            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${CDD}` }}>
              <h2 className="text-base font-bold" style={{ color: N }}>
                {modal === "create" ? "Yangi foydalanuvchi" : "Foydalanuvchini tahrirlash"}
              </h2>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: CD, color: T2 }}
                onMouseEnter={e => (e.currentTarget.style.background = CDD)}
                onMouseLeave={e => (e.currentTarget.style.background = CD)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>TO&apos;LIQ ISM *</label>
                <input value={form.fullName} onChange={e => f("fullName", e.target.value)}
                  placeholder="Ism Familiya" className={inpClass} style={inpStyle}
                  onFocus={e => { e.target.style.borderColor = N; }}
                  onBlur={e  => { e.target.style.borderColor = CDD; }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>TELEFON</label>
                <input value={form.phone} onChange={e => f("phone", e.target.value)}
                  placeholder="+998901234567" className={inpClass} style={inpStyle}
                  onFocus={e => { e.target.style.borderColor = N; }}
                  onBlur={e  => { e.target.style.borderColor = CDD; }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>FOYDALANUVCHI NOMI *</label>
                  <input value={form.username} onChange={e => f("username", e.target.value)}
                    placeholder="username" className={inpClass} style={inpStyle}
                    onFocus={e => { e.target.style.borderColor = N; }}
                    onBlur={e  => { e.target.style.borderColor = CDD; }} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>
                    {modal === "edit" ? "PAROL (o'zgartirish)" : "PAROL *"}
                  </label>
                  <input type="password" value={form.password} onChange={e => f("password", e.target.value)}
                    placeholder={modal === "edit" ? "Bo'sh qoldiring" : "Parol"}
                    className={inpClass} style={inpStyle}
                    onFocus={e => { e.target.style.borderColor = N; }}
                    onBlur={e  => { e.target.style.borderColor = CDD; }} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>ROL</label>
                <select value={form.role} onChange={e => f("role", e.target.value)}
                  className={`${inpClass} cursor-pointer appearance-none`} style={inpStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_CFG[r].label}</option>)}
                </select>
              </div>
              {err && (
                <p className="text-xs font-medium px-3 py-2.5 rounded-xl"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                  {err}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${CDD}` }}>
              <button onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: CD, color: T2, border: `1px solid ${CDD}` }}
                onMouseEnter={e => (e.currentTarget.style.background = CDD)}
                onMouseLeave={e => (e.currentTarget.style.background = CD)}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: saving ? `${ACCENT}99` : ACCENT, opacity: saving ? 0.8 : 1 }}>
                {saving && <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: `rgba(13,31,60,0.4)`, backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #fecaca", boxShadow: `0 20px 60px rgba(13,31,60,0.15)` }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #dc2626, #ef4444)" }} />
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-center mb-2" style={{ color: N }}>O&apos;chirishni tasdiqlang</h3>
              <p className="text-sm text-center mb-6" style={{ color: T2 }}>
                Bu foydalanuvchi tizimdan o&apos;chib ketadi.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: CD, color: T2, border: `1px solid ${CDD}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = CDD)}
                  onMouseLeave={e => (e.currentTarget.style.background = CD)}>
                  Bekor qilish
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: deleting ? "#ef444499" : "#dc2626" }}>
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
