"use client";
import { useState } from "react";
import Modal from "@/components/shared/Modal";

const VILOYATLAR = [
  "Toshkent","Samarqand","Farg'ona","Buxoro","Namangan","Andijon",
  "Xorazm","Qashqadaryo","Surxondaryo","Navoiy","Sirdaryo","Jizzax","Qoraqalpog'iston",
];
const TURLAR = [
  { key:"elektr", label:"Elektr",  icon:"⚡", color:"#f59e0b" },
  { key:"gaz",    label:"Gaz",     icon:"🔥", color:"#f97316" },
  { key:"suv",    label:"Suv",     icon:"💧", color:"#06b6d4" },
  { key:"yol",    label:"Yo'l",    icon:"🛣️", color:"#64748b" },
  { key:"quvur",  label:"Quvur",   icon:"🔧", color:"#8b5cf6" },
  { key:"boshqa", label:"Boshqa",  icon:"📋", color:"#3b82f6" },
];

type Tash = {
  id: number; nomi: string; tur: string; viloyat: string;
  admin: string; tel: string; manzil: string;
  xodimlar: number; bajarilgan: number; foiz: number; holat: string;
};

const INITIAL: Tash[] = [];

const EMPTY_FORM = { nomi:"", tur:"", viloyat:"", admin:"", tel:"", manzil:"", holat:"faol" };

export default function SuperadminTashkilotlarPage() {
  const [tashkilotlar, setTashkilotlar] = useState<Tash[]>(INITIAL);
  const [search,    setSearch]    = useState("");
  const [turFilter, setTurFilter] = useState("barchasi");
  const [modal,     setModal]     = useState(false);
  const [editId,    setEditId]    = useState<number | null>(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [delId,     setDelId]     = useState<number | null>(null);

  const filtered = tashkilotlar.filter(t => {
    const q = t.nomi.toLowerCase();
    const matchQ = q.includes(search.toLowerCase()) || t.viloyat.toLowerCase().includes(search.toLowerCase());
    const matchT = turFilter === "barchasi" || t.tur === turFilter;
    return matchQ && matchT;
  });

  const openAdd = () => {
    setEditId(null); setForm(EMPTY_FORM); setErrors({}); setModal(true);
  };
  const openEdit = (t: Tash) => {
    setEditId(t.id);
    setForm({ nomi:t.nomi, tur:t.tur, viloyat:t.viloyat, admin:t.admin, tel:t.tel, manzil:t.manzil, holat:t.holat });
    setErrors({}); setModal(true);
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.nomi.trim())  e.nomi    = "Nomi majburiy";
    if (!form.tur)          e.tur     = "Tur tanlang";
    if (!form.viloyat)      e.viloyat = "Viloyat tanlang";
    if (!form.admin)        e.admin   = "Admin tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const turInfo = TURLAR.find(t => t.key === form.tur);
    if (editId) {
      setTashkilotlar(prev => prev.map(t => t.id === editId
        ? { ...t, nomi:form.nomi, tur:form.tur, viloyat:form.viloyat, admin:form.admin, tel:form.tel, manzil:form.manzil, holat:form.holat }
        : t
      ));
    } else {
      setTashkilotlar(prev => [...prev, {
        id: Date.now(), nomi:form.nomi, tur:form.tur, viloyat:form.viloyat,
        admin:form.admin, tel:form.tel, manzil:form.manzil, holat:form.holat,
        xodimlar:0, bajarilgan:0, foiz:0,
      }]);
    }
    setModal(false);
  };

  const handleDelete = (id: number) => {
    setTashkilotlar(prev => prev.filter(t => t.id !== id));
    setDelId(null);
  };

  const F = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const COLORS: Record<string,string> = { elektr:"#f59e0b",quvur:"#8b5cf6",yol:"#64748b",gaz:"#f97316",suv:"#06b6d4",boshqa:"#3b82f6" };
  const ICONS:  Record<string,string> = { elektr:"⚡",quvur:"🔧",yol:"🛣️",gaz:"🔥",suv:"💧",boshqa:"📋" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Tashkilotlar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Barcha viloyatlar bo'yicha tashkilotlar</p>
        </div>
        <button onClick={openAdd}
          className="text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#34d399" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(16,185,129,0.15)")}>
          <span className="text-base">+</span> Tashkilot qo'shish
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tashkilot qidirish..."
          className="flex-1 min-w-[200px] text-sm px-4 py-2.5 rounded-xl outline-none"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.9)" }}
          onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.4)";}}
          onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
        />
        {["barchasi",...TURLAR.map(t=>t.key)].map(t => (
          <button key={t} onClick={()=>setTurFilter(t)}
            className="text-sm px-3 py-2 rounded-xl capitalize transition-all"
            style={{
              background: turFilter===t ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${turFilter===t ? "rgba(16,185,129,0.38)" : "rgba(255,255,255,0.08)"}`,
              color: turFilter===t ? "#34d399" : "rgba(150,180,230,0.6)",
            }}>
            {t !== "barchasi" ? `${ICONS[t]} ${t}` : "Barchasi"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["Tashkilot","Tur","Viloyat","Admin","Xodim","Samaradorlik","Holat",""].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const color = COLORS[t.tur] || "#3b82f6";
              const icon  = ICONS[t.tur]  || "📋";
              return (
                <tr key={t.id}
                  style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background:`${color}15`, border:`1px solid ${color}25` }}>{icon}</div>
                      <div>
                        <p className="font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{t.nomi}</p>
                        {t.manzil && <p className="text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>{t.manzil}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-md capitalize font-medium"
                      style={{ background:`${color}18`, color }}>{t.tur}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(150,180,230,0.65)" }}>{t.viloyat}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(150,180,230,0.55)" }}>{t.admin}</td>
                  <td className="px-4 py-3.5 font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>{t.xodimlar}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.06)", minWidth:60 }}>
                        <div className="h-full rounded-full" style={{
                          width:`${t.foiz}%`,
                          background: t.foiz>=80 ? "#10b981" : t.foiz>=65 ? "#f59e0b" : "#f43f5e",
                        }} />
                      </div>
                      <span className="text-xs font-bold w-8" style={{ color: t.foiz>=80?"#34d399":t.foiz>=65?"#fbbf24":"#fb7185" }}>
                        {t.foiz}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: t.holat==="faol"?"rgba(16,185,129,0.12)":"rgba(244,63,94,0.1)", color: t.holat==="faol"?"#34d399":"#fb7185" }}>
                      {t.holat}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(t)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.2)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.2)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(16,185,129,0.1)")}>
                        Tahrirlash
                      </button>
                      <button onClick={()=>setDelId(t.id)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color:"rgba(100,130,200,0.4)" }}>
            <div className="text-4xl mb-3">🏢</div>
            <p className="text-sm">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>Jami: {filtered.length} ta tashkilot</p>

      {/* ─── Add / Edit Modal ─── */}
      <Modal
        open={modal}
        onClose={()=>setModal(false)}
        title={editId ? "Tashkilotni tahrirlash" : "Yangi tashkilot qo'shish"}
        subtitle={editId ? "Ma'lumotlarni yangilang" : "Yangi tashkilot uchun ma'lumotlarni kiriting"}
      >
        <div className="space-y-4">
          {/* Nomi */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              🏢 Tashkilot nomi <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input value={form.nomi} onChange={e=>F("nomi",e.target.value)}
              placeholder="Tashkilot nomi"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.nomi?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,0.08)";}}
              onBlur={e=>{e.target.style.borderColor=errors.nomi?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
            {errors.nomi && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.nomi}</p>}
          </div>

          {/* Tur */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              ⚡ Tashkilot turi <span style={{ color:"#f87171" }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TURLAR.map(t => (
                <button key={t.key} type="button" onClick={()=>F("tur",t.key)}
                  className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                  style={{
                    background: form.tur===t.key ? `${t.color}20` : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${form.tur===t.key ? t.color : "rgba(255,255,255,0.08)"}`,
                    color: form.tur===t.key ? t.color : "rgba(150,180,230,0.55)",
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            {errors.tur && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.tur}</p>}
          </div>

          {/* Viloyat + Admin row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                🗺️ Viloyat <span style={{ color:"#f87171" }}>*</span>
              </label>
              <select value={form.viloyat} onChange={e=>F("viloyat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color: form.viloyat?"rgba(210,225,255,0.9)":"rgba(100,130,200,0.45)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";}}
                onBlur={e=>{e.target.style.borderColor=errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";}}
              >
                <option value="" style={{ background:"#111e38" }}>— Tanlang —</option>
                {VILOYATLAR.map(v => <option key={v} value={v} style={{ background:"#111e38" }}>{v}</option>)}
              </select>
              {errors.viloyat && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.viloyat}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                👤 Mas'ul admin <span style={{ color:"#f87171" }}>*</span>
              </label>
              <input value={form.admin} onChange={e=>F("admin",e.target.value)}
                placeholder="Admin ismi..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.admin?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";}}
                onBlur={e=>{e.target.style.borderColor=errors.admin?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";}}
              />
              {errors.admin && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.admin}</p>}
            </div>
          </div>

          {/* Telefon + Holat row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                📞 Telefon
              </label>
              <input value={form.tel} onChange={e=>F("tel",e.target.value)}
                placeholder="+998 71 000 00 00"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                ✅ Holat
              </label>
              <select value={form.holat} onChange={e=>F("holat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
              >
                <option value="faol"   style={{ background:"#111e38" }}>Faol</option>
                <option value="nofaol" style={{ background:"#111e38" }}>Nofaol</option>
              </select>
            </div>
          </div>

          {/* Manzil */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              📍 Manzil
            </label>
            <input value={form.manzil} onChange={e=>F("manzil",e.target.value)}
              placeholder="Shahar, ko'cha..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={()=>setModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
              Bekor qilish
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background:"rgba(16,185,129,0.18)", border:"1px solid rgba(16,185,129,0.38)", color:"#34d399" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.28)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(16,185,129,0.18)")}>
              {editId ? "✓ Saqlash" : "+ Qo'shish"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Delete confirm ─── */}
      <Modal open={delId !== null} onClose={()=>setDelId(null)} title="Tashkilotni o'chirish" width="max-w-sm">
        <p className="text-sm mb-6" style={{ color:"rgba(150,180,230,0.75)" }}>
          Ushbu tashkilotni tizimdan o'chirishni tasdiqlaysizmi? Unga tegishli barcha ma'lumotlar o'chiriladi.
        </p>
        <div className="flex gap-3">
          <button onClick={()=>setDelId(null)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
            Bekor
          </button>
          <button onClick={()=>delId && handleDelete(delId)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background:"rgba(244,63,94,0.15)", border:"1px solid rgba(244,63,94,0.3)", color:"#f87171" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.25)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}>
            🗑 O'chirish
          </button>
        </div>
      </Modal>
    </div>
  );
}
