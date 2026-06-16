"use client";
import { useState } from "react";

const MOCK_USERS: { id:number; ism:string; email:string; tel:string; viloyat:string; momolar:number; holat:string; sana:string }[] = [];

export default function AdminUserlarPage() {
  const [search, setSearch] = useState("");
  const [holatFilter, setHolatFilter] = useState("barchasi");

  const filtered = MOCK_USERS.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.ism.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.viloyat.toLowerCase().includes(q);
    const matchH = holatFilter === "barchasi" || u.holat === holatFilter;
    return matchQ && matchH;
  });

  const holatStyle: Record<string, { bg: string; color: string }> = {
    faol:       { bg:"rgba(16,185,129,0.12)",  color:"#34d399" },
    bloklangan: { bg:"rgba(244,63,94,0.12)",   color:"#fb7185" },
    kutilmoqda: { bg:"rgba(245,158,11,0.12)",  color:"#fbbf24" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Foydalanuvchilar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Tizimda ro'yxatdan o'tgan barcha userlar</p>
        </div>
        <button className="text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
          + User qo'shish
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qidirish..."
          className="flex-1 min-w-[200px] text-sm px-4 py-2.5 rounded-xl outline-none"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.9)" }} />
        {["barchasi","faol","bloklangan","kutilmoqda"].map(h => (
          <button key={h} onClick={()=>setHolatFilter(h)}
            className="text-sm px-4 py-2 rounded-xl capitalize transition-all"
            style={{
              background: holatFilter===h ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${holatFilter===h ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: holatFilter===h ? "#60a5fa" : "rgba(150,180,230,0.6)",
            }}>
            {h}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#","Ism","Email","Telefon","Viloyat","Momolar","Holat","Sana",""].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "rgba(255,255,255,0.01)" : "transparent" }}
                className="transition-all hover:bg-white/[0.02]">
                <td className="px-4 py-3.5" style={{ color:"rgba(100,130,200,0.5)" }}>{u.id}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background:"rgba(59,130,246,0.15)", color:"#60a5fa" }}>
                      {u.ism[0]}
                    </div>
                    <span className="font-medium" style={{ color:"rgba(200,220,255,0.9)" }}>{u.ism}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5" style={{ color:"rgba(150,180,230,0.65)" }}>{u.email}</td>
                <td className="px-4 py-3.5" style={{ color:"rgba(150,180,230,0.65)" }}>{u.tel}</td>
                <td className="px-4 py-3.5" style={{ color:"rgba(150,180,230,0.65)" }}>{u.viloyat}</td>
                <td className="px-4 py-3.5">
                  <span className="font-bold" style={{ color:"rgba(200,220,255,0.85)" }}>{u.momolar}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                    style={{ background: holatStyle[u.holat]?.bg, color: holatStyle[u.holat]?.color }}>
                    {u.holat}
                  </span>
                </td>
                <td className="px-4 py-3.5" style={{ color:"rgba(100,130,200,0.5)" }}>{u.sana}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button className="text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{ background:"rgba(59,130,246,0.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.2)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.1)")}>
                      Ko'rish
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                      Blok
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color:"rgba(100,130,200,0.4)" }}>
            <div className="text-4xl mb-3">👥</div>
            <p className="text-sm">Hech narsa topilmadi</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>
        Jami: {filtered.length} ta foydalanuvchi
      </p>
    </div>
  );
}
