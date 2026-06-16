"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useGeolocation } from "@/hooks/useGeolocation";
import { createProblem } from "@/services/problemService";
import { useAuthStore } from "@/store/authStore";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl flex items-center justify-center"
      style={{ height:280, background:"#0a1628", border:"1px solid rgba(59,130,246,0.15)" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-2"
          style={{ borderColor:"rgba(59,130,246,0.2)", borderTopColor:"#3b82f6" }} />
        <p className="text-xs" style={{ color:"rgba(96,165,250,0.5)" }}>Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

const TYPES = [
  { value:"ELEKTR", label:"Elektr",  emoji:"⚡", color:"#f59e0b" },
  { value:"SUV",    label:"Suv",     emoji:"💧", color:"#06b6d4" },
  { value:"GAZ",    label:"Gaz",     emoji:"🔥", color:"#ef4444" },
  { value:"YOL",    label:"Yo'l",    emoji:"🛣️", color:"#8b5cf6" },
  { value:"HUJJAT", label:"Hujjat",  emoji:"📄", color:"#64748b" },
  { value:"BOSHQA", label:"Boshqa",  emoji:"⚠️", color:"#f43f5e" },
];

const DEPARTMENTS = [
  { value:"QURILISH",     label:"Qurilish bo'limi"     },
  { value:"INVESTITSIYA", label:"Investitsiya bo'limi"  },
  { value:"TASHKILOT",    label:"Tashkilot"             },
  { value:"BOSHQA",       label:"Boshqa"                },
];

const boxStyle = {
  background:"rgba(255,255,255,0.03)",
  border:"1px solid rgba(255,255,255,0.08)",
  borderRadius:16,
};

const inputStyle = {
  background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.08)",
  color:"rgba(200,220,255,0.85)",
  borderRadius:12,
};

export default function MomoYuborishPage() {
  const { user } = useAuthStore();

  const [title,       setTitle]       = useState("");
  const [type,        setType]        = useState("");
  const [description, setDescription] = useState("");
  const [department,  setDepartment]  = useState("");
  const [projectId,   setProjectId]   = useState("");
  const [mapCoords,   setMapCoords]   = useState<{lat:number;lng:number}|null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [submitted,   setSubmitted]   = useState<{id:number;title:string}|null>(null);

  const { position, loading:geoLoading, error:geoError, getLocation } = useGeolocation();
  const finalPos = position ?? mapCoords;

  const step1Done = !!title.trim() && !!type;
  const step2Done = !!description.trim() && !!department;
  const step3Done = !!finalPos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Done) return setError("Sarlavha va muammo turini kiriting");
    if (!step2Done) return setError("Tavsif va mas'ul bo'limni kiriting");
    if (!step3Done) return setError("Lokatsiyani belgilang");

    setLoading(true);
    setError("");
    try {
      const result = await createProblem({
        projectId:             projectId.trim() ? Number(projectId) : 0,
        createdById:           Number(user?.id ?? 0),
        type,
        title:                 title.trim(),
        description:           description.trim(),
        responsibleDepartment: department,
        latitude:              finalPos!.lat,
        longitude:             finalPos!.lng,
      });
      setSubmitted({ id: result.id, title: result.title });
    } catch {
      setError("Yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Muvaffaqiyat ekrani ── */
  if (submitted) return (
    <div className="max-w-lg mx-auto space-y-4 pt-8">
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
          style={{ background:"rgba(16,185,129,0.12)", border:"2px solid rgba(16,185,129,0.3)", boxShadow:"0 0 40px rgba(16,185,129,0.15)" }}>
          ✅
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color:"rgba(220,235,255,0.95)" }}>Muammo yuborildi!</h2>
        <p className="text-sm mb-1" style={{ color:"rgba(120,150,200,0.6)" }}>{submitted.title}</p>
        <p className="text-xs font-mono" style={{ color:"rgba(52,211,153,0.55)" }}>ID: #{submitted.id}</p>
      </div>
      <div className="p-4 rounded-2xl text-center text-sm"
        style={{ background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.2)", color:"rgba(52,211,153,0.8)" }}>
        Muammo mas'ul bo'limga yuborildi va tez orada ko'rib chiqiladi.
      </div>
      <Link href="/user/mening-momolarim"
        className="block w-full text-center py-3 rounded-xl text-sm font-bold"
        style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}>
        Momolarimni ko'rish →
      </Link>
      <button onClick={() => {
        setSubmitted(null); setTitle(""); setType(""); setDescription("");
        setDepartment(""); setProjectId(""); setMapCoords(null);
      }} className="block w-full text-center py-3 rounded-xl text-sm"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(150,175,220,0.7)" }}>
        Yangi muammo yuborish
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Muammo yuborish</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Muammo haqida to'liq ma'lumot kiriting
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0 mb-6 p-4 rounded-2xl"
        style={{ background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.12)" }}>
        {[
          { n:1, l:"Asosiy ma'lumot", done:step1Done },
          { n:2, l:"Tavsif",          done:step2Done },
          { n:3, l:"Lokatsiya",       done:step3Done },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                style={{
                  background: s.done ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.18)",
                  border:     s.done ? "1.5px solid #10b981"   : "1.5px solid rgba(59,130,246,0.35)",
                  color:      s.done ? "#34d399"               : "#60a5fa",
                }}>
                {s.done ? "✓" : s.n}
              </div>
              <span className="text-sm font-medium hidden sm:block"
                style={{ color: s.done ? "rgba(52,211,153,0.8)" : "rgba(96,165,250,0.7)" }}>{s.l}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px mx-3 hidden sm:block"
              style={{ background: s.done ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.12)" }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">

        {/* ── 1: Asosiy ma'lumot ── */}
        <div className="p-5 rounded-2xl space-y-4" style={boxStyle}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step1Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)",
                color: step1Done ? "#34d399" : "#60a5fa",
                border: `1px solid ${step1Done ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.3)"}` }}>
              {step1Done ? "✓" : "1"}
            </span>
            Asosiy ma&apos;lumot
          </h3>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Sarlavha <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Masalan: Ko'chada suv quvuri buzilgan..."
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
          </div>

          {/* Muammo turi */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color:"rgba(140,165,220,0.7)" }}>
              Muammo turi <span style={{ color:"#f87171" }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: type === t.value ? `${t.color}20` : "rgba(255,255,255,0.04)",
                    border:     type === t.value ? `1.5px solid ${t.color}60` : "1px solid rgba(255,255,255,0.08)",
                    color:      type === t.value ? t.color : "rgba(150,175,220,0.6)",
                  }}>
                  <span>{t.emoji}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Loyiha ID (ixtiyoriy) */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Loyiha ID <span className="text-[10px]" style={{ color:"rgba(100,130,200,0.5)" }}>(ixtiyoriy)</span>
            </label>
            <input value={projectId} onChange={e => setProjectId(e.target.value)} type="number"
              placeholder="Masalan: 1"
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
          </div>
        </div>

        {/* ── 2: Tavsif + Bo'lim ── */}
        <div className="p-5 rounded-2xl space-y-4" style={boxStyle}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step2Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)",
                color: step2Done ? "#34d399" : "#60a5fa",
                border: `1px solid ${step2Done ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.3)"}` }}>
              {step2Done ? "✓" : "2"}
            </span>
            Tavsif va mas&apos;ul bo&apos;lim
          </h3>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Tavsif <span style={{ color:"#f87171" }}>*</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Muammoni batafsil yozing..."
              rows={3} className="w-full text-sm px-4 py-3 outline-none resize-none"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
          </div>

          {/* Responsible Department */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color:"rgba(140,165,220,0.7)" }}>
              Mas&apos;ul bo&apos;lim <span style={{ color:"#f87171" }}>*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(d => (
                <button key={d.value} type="button" onClick={() => setDepartment(d.value)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
                  style={{
                    background: department === d.value ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                    border:     department === d.value ? "1.5px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color:      department === d.value ? "#60a5fa" : "rgba(150,175,220,0.6)",
                  }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3: Lokatsiya ── */}
        <div className="p-5 rounded-2xl" style={boxStyle}>
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step3Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)",
                color: step3Done ? "#34d399" : "#60a5fa",
                border: `1px solid ${step3Done ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.3)"}` }}>
              {step3Done ? "✓" : "3"}
            </span>
            Lokatsiya <span className="text-xs" style={{ color:"#f87171" }}>*</span>
          </h3>
          <p className="text-xs mb-3 ml-8" style={{ color:"rgba(100,130,200,0.5)" }}>
            Xaritaga bosib muammo joylashuvini belgilang yoki GPS dan foydalaning
          </p>

          <div className="flex gap-2 mb-3">
            <button type="button" onClick={getLocation} disabled={geoLoading}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"#34d399" }}
              onMouseEnter={e => { if (!geoLoading) e.currentTarget.style.background = "rgba(16,185,129,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}>
              {geoLoading
                ? <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(52,211,153,0.3)", borderTopColor:"#34d399" }} /> Aniqlanmoqda...</>
                : <>📡 GPS joylashuvni olish</>
              }
            </button>
            {finalPos && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"rgba(52,211,153,0.8)" }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"#10b981", boxShadow:"0 0 4px #10b981" }} />
                {finalPos.lat.toFixed(5)}, {finalPos.lng.toFixed(5)}
              </div>
            )}
          </div>
          {geoError && <p className="text-xs mb-2" style={{ color:"#f87171" }}>⚠️ {geoError}</p>}

          <LocationPicker
            onSelect={(lat, lng) => setMapCoords({ lat, lng })}
            initialLat={position?.lat}
            initialLng={position?.lng}
            height={300}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={(e:any) => { if (!loading) { e.currentTarget.style.background="rgba(59,130,246,0.28)"; e.currentTarget.style.boxShadow="0 0 24px rgba(59,130,246,0.2)"; } }}
          onMouseLeave={(e:any) => { e.currentTarget.style.background="rgba(59,130,246,0.15)"; e.currentTarget.style.boxShadow="none"; }}>
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(96,165,250,0.3)", borderTopColor:"rgba(96,165,250,0.9)" }} />
                Yuborilmoqda...
              </span>
            : "🚀 Muammo yuborish"
          }
        </button>
      </form>
    </div>
  );
}
