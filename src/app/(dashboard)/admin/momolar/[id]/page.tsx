"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_MOMOLAR, STATUS_COLORS, STATUS_LABELS, NEXT_STATUS, NEXT_BTN } from "@/data/mockMomolar";
import { MomoStatus } from "@/types/momo.types";

const TASHKILOTLAR = [
  "Samarqand Energo",
  "Samarqand Suv ta'minoti",
  "Samarqand Gaz",
  "Yo'l xo'jaligi",
  "Kommunal xizmat",
];

const STEPS: { key: MomoStatus; label: string; icon: string }[] = [
  { key:"yuborildi",         label:"Yuborildi",          icon:"📤" },
  { key:"korib_chiqilmoqda", label:"Ko'rib chiqilmoqda", icon:"🔍" },
  { key:"bajarilmoqda",      label:"Bajarilmoqda",       icon:"⚙️" },
  { key:"bajarildi",         label:"Bajarildi",          icon:"✅" },
];
const STEP_IDX: Record<MomoStatus, number> = {
  yuborildi:0, korib_chiqilmoqda:1, bajarilmoqda:2, bajarildi:3,
};

export default function AdminMomoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const base = MOCK_MOMOLAR.find(m => m.id === id) || {
    id: id as string, tur:"elektr" as any, icon:"📋", color:"#8b5cf6",
    tavsif:"Ma'lumotlar topilmadi", manzil:"—", sana:"—",
    holat:"yuborildi" as MomoStatus, tashkilot:"—", yuboruvchi:"—",
    tel:"—", koordinata:"—", shoshilinch:false,
    izoh: undefined as string | undefined,
    deadline: undefined as string | undefined,
    xodim: undefined as string | undefined,
    tarix:[{ holat:"yuborildi" as MomoStatus, vaqt:"—", izoh: undefined as string | undefined }],
  };

  const [holat,      setHolat]      = useState<MomoStatus>(base.holat);
  const [tashkilot,  setTashkilot]  = useState(base.tashkilot);
  const [deadline,   setDeadline]   = useState(base.deadline || "");
  const [xodim,      setXodim]      = useState(base.xodim || "");
  const [izohInput,  setIzohInput]  = useState("");
  const [tarix,      setTarix]      = useState(base.tarix);
  const [saved,      setSaved]      = useState(false);

  const stepIdx = STEP_IDX[holat];

  const advanceStatus = () => {
    const next = NEXT_STATUS[holat];
    if (!next) return;
    setHolat(next);
    setTarix(prev => [...prev, { holat: next, vaqt: new Date().toLocaleString("uz-UZ"), izoh: izohInput || undefined }]);
    setIzohInput("");
  };

  const saveChanges = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sc = STATUS_COLORS[holat];

  return (
    <div className="max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/momolar"
          className="text-sm px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(150,180,230,0.65)" }}>
          ← Orqaga
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color:"rgba(220,235,255,0.95)" }}>Momo {base.id}</h1>
          {base.shoshilinch && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
              style={{ background:"rgba(244,63,94,0.15)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
              🔴 Shoshilinch
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background:`${sc}18`, color:sc, border:`1px solid ${sc}30` }}>
            {STATUS_LABELS[holat]}
          </span>
        </div>
      </div>

      {/* Main info */}
      <div className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background:`${base.color}18`, border:`1.5px solid ${base.color}35`, boxShadow:`0 0 20px ${base.color}20` }}>
            {base.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2" style={{ color:"rgba(200,220,255,0.95)" }}>
              {base.tur.charAt(0).toUpperCase()+base.tur.slice(1)} momosi
            </h2>
            <p className="text-sm leading-relaxed" style={{ color:"rgba(150,180,230,0.75)" }}>{base.tavsif}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label:"Yuboruvchi", val:base.yuboruvchi, icon:"👤" },
            { label:"Telefon",    val:base.tel,        icon:"📞" },
            { label:"Manzil",     val:base.manzil,     icon:"📍" },
            { label:"Yuborilgan", val:base.sana,       icon:"🕐" },
            { label:"Koordinata", val:base.koordinata, icon:"🌐" },
            { label:"Momo ID",    val:base.id,         icon:"🔖" },
          ].map(r => (
            <div key={r.label} className="p-3 rounded-xl"
              style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[10px] mb-1 flex items-center gap-1" style={{ color:"rgba(100,130,200,0.5)" }}>
                {r.icon} {r.label}
              </p>
              <p className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.85)" }}>{r.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin controls */}
      <div className="p-5 rounded-2xl space-y-4" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-sm font-bold" style={{ color:"rgba(150,180,230,0.75)" }}>⚙️ Admin boshqaruvi</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tashkilot */}
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color:"rgba(100,130,200,0.55)" }}>
              🏢 Tashkilotga tayinlash
            </label>
            <select value={tashkilot} onChange={e=>setTashkilot(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,220,255,0.85)" }}>
              <option value="" style={{ background:"#111e38" }}>— Tanlang —</option>
              {TASHKILOTLAR.map(t => (
                <option key={t} value={t} style={{ background:"#111e38" }}>{t}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color:"rgba(100,130,200,0.55)" }}>
              ⏰ Muddat belgilash
            </label>
            <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,220,255,0.85)", colorScheme:"dark" }}
            />
          </div>

          {/* Xodim */}
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold block mb-1.5" style={{ color:"rgba(100,130,200,0.55)" }}>
              👷 Mas'ul xodim
            </label>
            <input value={xodim} onChange={e=>setXodim(e.target.value)}
              placeholder="Xodim ismi..."
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,220,255,0.85)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.35)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
            />
          </div>
        </div>

        <button onClick={saveChanges}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: saved ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.15)",
            border: `1px solid ${saved ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.3)"}`,
            color: saved ? "#34d399" : "#60a5fa",
          }}>
          {saved ? "✓ Saqlandi!" : "💾 O'zgarishlarni saqlash"}
        </button>
      </div>

      {/* Status update */}
      {NEXT_BTN[holat] && (
        <div className="p-5 rounded-2xl space-y-3" style={{ background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.15)" }}>
          <p className="text-sm font-bold" style={{ color:"rgba(150,230,200,0.8)" }}>🔄 Holat o'zgartirish</p>
          <textarea value={izohInput} onChange={e=>setIzohInput(e.target.value)}
            placeholder="Izoh qoldiring (ixtiyoriy)..."
            rows={2}
            className="w-full text-sm px-3 py-2.5 rounded-xl outline-none resize-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.3)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
          />
          <button onClick={advanceStatus}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background:"rgba(16,185,129,0.18)", border:"1px solid rgba(16,185,129,0.35)", color:"#34d399" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.28)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(16,185,129,0.18)")}>
            ✓ {NEXT_BTN[holat]}
          </button>
        </div>
      )}

      {/* Progress stepper */}
      <div className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm font-bold mb-5" style={{ color:"rgba(150,180,230,0.75)" }}>Jarayon holati</p>
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const done   = i <= stepIdx;
            const active = i === stepIdx;
            const sc2    = done ? STATUS_COLORS[step.key] : "rgba(255,255,255,0.12)";
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all"
                    style={{
                      background: active ? `${STATUS_COLORS[step.key]}28` : done ? `${STATUS_COLORS[step.key]}18` : "rgba(255,255,255,0.04)",
                      border: `2px solid ${done ? STATUS_COLORS[step.key] : "rgba(255,255,255,0.1)"}`,
                      boxShadow: active ? `0 0 16px ${STATUS_COLORS[step.key]}50` : "none",
                    }}>
                    {done ? step.icon : <span style={{ fontSize:12, color:"rgba(100,130,200,0.4)" }}>{i+1}</span>}
                  </div>
                  <span className="text-[10px] font-medium text-center hidden sm:block"
                    style={{ color: done ? sc2 : "rgba(100,130,200,0.35)", maxWidth:70 }}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length-1 && (
                  <div className="flex-1 h-0.5 mx-1 transition-all"
                    style={{ background: i < stepIdx ? STATUS_COLORS[STEPS[i+1].key] : "rgba(255,255,255,0.07)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm font-bold mb-4" style={{ color:"rgba(150,180,230,0.75)" }}>Holat tarixi</p>
        <div className="space-y-0">
          {[...tarix].reverse().map((t, i) => {
            const color = STATUS_COLORS[t.holat];
            return (
              <div key={i} className="flex gap-4 pb-4 relative">
                {i < tarix.length-1 && (
                  <div className="absolute left-4 top-8 w-0.5 bottom-0"
                    style={{ background:"rgba(255,255,255,0.07)" }} />
                )}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{ background:`${color}22`, border:`1.5px solid ${color}`, boxShadow:`0 0 10px ${color}40` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background:color, display:"block" }} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background:`${color}18`, color, border:`1px solid ${color}30` }}>
                      {STATUS_LABELS[t.holat]}
                    </span>
                    <span className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>{t.vaqt}</span>
                  </div>
                  {t.izoh && (
                    <p className="text-sm mt-1 px-3 py-2 rounded-lg"
                      style={{ background:"rgba(255,255,255,0.03)", color:"rgba(150,180,230,0.7)", border:"1px solid rgba(255,255,255,0.06)" }}>
                      {t.izoh}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
