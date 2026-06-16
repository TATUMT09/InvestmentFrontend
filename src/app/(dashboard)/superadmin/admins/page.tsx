"use client";
import { useState } from "react";
import Modal from "@/components/shared/Modal";

const VILOYATLAR = [
  "Toshkent","Samarqand","Farg'ona","Buxoro","Namangan","Andijon",
  "Xorazm","Qashqadaryo","Surxondaryo","Navoiy","Sirdaryo","Jizzax","Qoraqalpog'iston",
];

type Admin = {
  id: number; ism: string; email: string; viloyat: string;
  tel: string; userlar: number; tashkilotlar: number; holat: string; sana: string;
};

const INITIAL: Admin[] = [];

const EMPTY_FORM = { ism:"", email:"", parol:"", viloyat:"", tel:"", holat:"faol" };

export default function SuperadminAdminsPage() {
  const [admins,  setAdmins]  = useState<Admin[]>(INITIAL);
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(false);
  const [editId,  setEditId]  = useState<number | null>(null);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [delId,   setDelId]   = useState<number | null>(null);

  const filtered = admins.filter(a =>
    a.ism.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.viloyat.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModal(true);
  };

  const openEdit = (a: Admin) => {
    setEditId(a.id);
    setForm({ ism:a.ism, email:a.email, parol:"", viloyat:a.viloyat, tel:a.tel, holat:a.holat });
    setErrors({});
    setModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.ism.trim())         e.ism    = "Ism majburiy";
    if (!form.email.includes("@")) e.email  = "Email noto'g'ri";
    if (!editId && !form.parol)   e.parol  = "Parol majburiy";
    if (!form.viloyat)            e.viloyat = "Viloyat tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editId) {
      setAdmins(prev => prev.map(a => a.id === editId
        ? { ...a, ism:form.ism, email:form.email, viloyat:form.viloyat, tel:form.tel, holat:form.holat }
        : a
      ));
    } else {
      setAdmins(prev => [...prev, {
        id: Date.now(), ism:form.ism, email:form.email, viloyat:form.viloyat,
        tel:form.tel, holat:form.holat, userlar:0, tashkilotlar:0,
        sana: new Date().toISOString().slice(0,10),
      }]);
    }
    setModal(false);
  };

  const handleDelete = (id: number) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    setDelId(null);
  };

  const F = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Adminlar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Tizimga tayinlangan barcha adminlar</p>
        </div>
        <button onClick={openAdd}
          className="text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", color:"#a78bfa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(139,92,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(139,92,246,0.15)")}>
          <span className="text-base">+</span> Admin qo'shish
        </button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Admin qidirish..."
        className="w-full max-w-sm text-sm px-4 py-2.5 rounded-xl outline-none mb-5"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.9)" }}
        onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.4)";}}
        onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
      />

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#","Admin","Viloyat","Tel","Userlar","Tashkilotlar","Holat","Qo'shildi",""].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}
                style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <td className="px-4 py-3.5" style={{ color:"rgba(100,130,200,0.5)" }}>{i+1}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background:"rgba(139,92,246,0.15)", color:"#a78bfa" }}>
                      {a.ism[0]}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{a.ism}</p>
                      <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>{a.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5" style={{ color:"rgba(150,180,230,0.65)" }}>{a.viloyat}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(130,160,210,0.55)" }}>{a.tel || "—"}</td>
                <td className="px-4 py-3.5 font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>{a.userlar}</td>
                <td className="px-4 py-3.5 font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>{a.tashkilotlar}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: a.holat==="faol" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.1)",
                      color: a.holat==="faol" ? "#34d399" : "#fb7185",
                    }}>
                    {a.holat}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{a.sana}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button onClick={()=>openEdit(a)}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{ background:"rgba(139,92,246,0.1)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.2)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="rgba(139,92,246,0.2)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="rgba(139,92,246,0.1)")}>
                      Tahrirlash
                    </button>
                    <button onClick={()=>setDelId(a.id)}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                      O'chirish
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color:"rgba(100,130,200,0.4)" }}>
            <div className="text-4xl mb-3">👤</div>
            <p className="text-sm">Admin topilmadi</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>Jami: {filtered.length} ta admin</p>

      {/* ─── Add / Edit Modal ─── */}
      <Modal
        open={modal}
        onClose={()=>setModal(false)}
        title={editId ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
        subtitle={editId ? "Ma'lumotlarni yangilang" : "Yangi admin uchun ma'lumotlarni kiriting"}
      >
        <div className="space-y-4">
          {/* Ism */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              👤 To'liq ism <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input value={form.ism} onChange={e=>F("ism",e.target.value)}
              placeholder="Ism Familiya"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.ism?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)";}}
              onBlur={e=>{e.target.style.borderColor=errors.ism?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
            {errors.ism && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.ism}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              📧 Email <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input type="email" value={form.email} onChange={e=>F("email",e.target.value)}
              placeholder="admin@domain.uz"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.email?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)";}}
              onBlur={e=>{e.target.style.borderColor=errors.email?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.email}</p>}
          </div>

          {/* Parol */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              🔒 Parol {!editId && <span style={{ color:"#f87171" }}>*</span>}
              {editId && <span style={{ color:"rgba(100,130,200,0.4)" }}> (o'zgartirmasangiz bo'sh qoldiring)</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.parol} onChange={e=>F("parol",e.target.value)}
                placeholder={editId ? "Yangi parol (ixtiyoriy)" : "Kamida 6 ta belgi"}
                className="w-full text-sm px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.parol?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)";}}
                onBlur={e=>{e.target.style.borderColor=errors.parol?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
              />
              <button type="button" onClick={()=>setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color:"rgba(120,150,200,0.5)" }}>
                {showPwd
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.parol && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.parol}</p>}
          </div>

          {/* Viloyat + Holat row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                🗺️ Viloyat <span style={{ color:"#f87171" }}>*</span>
              </label>
              <select value={form.viloyat} onChange={e=>F("viloyat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color: form.viloyat ? "rgba(210,225,255,0.9)" : "rgba(100,130,200,0.45)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";}}
                onBlur={e=>{e.target.style.borderColor=errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";}}
              >
                <option value="" style={{ background:"#111e38" }}>— Tanlang —</option>
                {VILOYATLAR.map(v => <option key={v} value={v} style={{ background:"#111e38" }}>{v}</option>)}
              </select>
              {errors.viloyat && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.viloyat}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                ✅ Holat
              </label>
              <select value={form.holat} onChange={e=>F("holat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
              >
                <option value="faol"   style={{ background:"#111e38" }}>Faol</option>
                <option value="nofaol" style={{ background:"#111e38" }}>Nofaol</option>
              </select>
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              📞 Telefon
            </label>
            <input value={form.tel} onChange={e=>F("tel",e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)";}}
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
              style={{ background:"rgba(139,92,246,0.2)", border:"1px solid rgba(139,92,246,0.4)", color:"#a78bfa" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(139,92,246,0.32)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(139,92,246,0.2)")}>
              {editId ? "✓ Saqlash" : "+ Qo'shish"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Delete confirm ─── */}
      <Modal open={delId !== null} onClose={()=>setDelId(null)} title="Adminni o'chirish" width="max-w-sm">
        <p className="text-sm mb-6" style={{ color:"rgba(150,180,230,0.75)" }}>
          Ushbu adminni tizimdan o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
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
