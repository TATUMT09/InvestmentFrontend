"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getMyProjects } from "@/services/projectService";
import { createProjectUpdate } from "@/services/projectUpdateService";
import type { Project } from "@/types/api.types";

const STATUS_OPTIONS = [
  { value: "REJALASHTIRILGAN", label: "Rejalashtirilgan", emoji: "🗓️", color: "#60a5fa" },
  { value: "JARAYONDA",        label: "Jarayonda",        emoji: "⚡", color: "#f59e0b" },
  { value: "KECHIKKAN",        label: "Kechikkan",        emoji: "⏰", color: "#f97316" },
  { value: "MUAMMOLI",         label: "Muammoli",         emoji: "⚠️", color: "#ef4444" },
  { value: "TUGALLANGAN",      label: "Tugallangan",      emoji: "✅", color: "#10b981" },
];

const boxStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(200,220,255,0.85)",
  borderRadius: 12,
};

export default function MalumotYuborishPage() {
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [projectId,   setProjectId]   = useState("");
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [status,      setStatus]      = useState("");
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [preview,     setPreview]     = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [submitted,   setSubmitted]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId)        return setError("Loyihani tanlang");
    if (!title.trim())     return setError("Sarlavha kiriting");
    if (!status)           return setError("Holat tanlang");

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("projectId",   projectId);
      fd.append("title",       title.trim());
      fd.append("description", description.trim());
      fd.append("status",      status);
      if (imageFile) fd.append("image", imageFile);

      await createProjectUpdate(fd);
      setSubmitted(true);
    } catch {
      setError("Yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setProjectId(""); setTitle(""); setDescription("");
    setStatus(""); setImageFile(null); setPreview(null);
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto space-y-4 pt-8">
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
          style={{ background:"rgba(16,185,129,0.12)", border:"2px solid rgba(16,185,129,0.3)", boxShadow:"0 0 40px rgba(16,185,129,0.15)" }}>
          ✅
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color:"rgba(220,235,255,0.95)" }}>Ma&apos;lumot yuborildi!</h2>
        <p className="text-sm" style={{ color:"rgba(120,150,200,0.6)" }}>Loyiha jarayoni haqidagi ma&apos;lumot muvaffaqiyatli yuborildi.</p>
      </div>
      <div className="p-4 rounded-2xl text-center text-sm"
        style={{ background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.2)", color:"rgba(52,211,153,0.8)" }}>
        Hokim va investitsiya bo&apos;limi xodimi ma&apos;lumotni ko&apos;rishi mumkin.
      </div>
      <Link href="/user/malumotlarim"
        className="block w-full text-center py-3 rounded-xl text-sm font-bold"
        style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}>
        Ma&apos;lumotlarimni ko&apos;rish →
      </Link>
      <button onClick={reset}
        className="block w-full text-center py-3 rounded-xl text-sm"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(150,175,220,0.7)" }}>
        Yangi ma&apos;lumot yuborish
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Ma&apos;lumot yuborish</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Loyiha jarayoni haqida yangilik yuboring
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">

        {/* ── 1: Loyiha va sarlavha ── */}
        <div className="p-5 rounded-2xl space-y-4" style={boxStyle}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background:"rgba(59,130,246,0.18)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)" }}>
              1
            </span>
            Asosiy ma&apos;lumot
          </h3>

          {/* Loyiha */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Loyiha <span style={{ color:"#f87171" }}>*</span>
            </label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={{ ...inputStyle, borderRadius:12 }}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }}>
              <option value="" style={{ background:"#0d1528" }}>— Loyihani tanlang —</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} style={{ background:"#0d1528" }}>{p.name}</option>
              ))}
            </select>
            {projects.length === 0 && (
              <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.5)" }}>
                Sizga biriktirilgan loyihalar topilmadi
              </p>
            )}
          </div>

          {/* Sarlavha */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Sarlavha <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Masalan: Poydevor ishlari yakunlandi..."
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
          </div>
        </div>

        {/* ── 2: Holat ── */}
        <div className="p-5 rounded-2xl space-y-4" style={boxStyle}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background:"rgba(59,130,246,0.18)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)" }}>
              2
            </span>
            Loyiha holati <span style={{ color:"#f87171" }}>*</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATUS_OPTIONS.map(s => (
              <button key={s.value} type="button" onClick={() => setStatus(s.value)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: status === s.value ? `${s.color}20` : "rgba(255,255,255,0.04)",
                  border:     status === s.value ? `1.5px solid ${s.color}60` : "1px solid rgba(255,255,255,0.08)",
                  color:      status === s.value ? s.color : "rgba(150,175,220,0.6)",
                }}>
                <span>{s.emoji}</span>
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 3: Tavsif va rasm ── */}
        <div className="p-5 rounded-2xl space-y-4" style={boxStyle}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background:"rgba(59,130,246,0.18)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)" }}>
              3
            </span>
            Tavsif va rasm
          </h3>

          {/* Tavsif */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Tavsif <span className="text-[10px]" style={{ color:"rgba(100,130,200,0.5)" }}>(ixtiyoriy)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Jarayon haqida batafsil yozing..."
              rows={3} className="w-full text-sm px-4 py-3 outline-none resize-none"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.4)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
          </div>

          {/* Rasm */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color:"rgba(140,165,220,0.7)" }}>
              Rasm <span className="text-[10px]" style={{ color:"rgba(100,130,200,0.5)" }}>(ixtiyoriy)</span>
            </label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview"
                  className="w-full max-h-48 object-cover rounded-xl"
                  style={{ border:"1px solid rgba(255,255,255,0.1)" }} />
                <button type="button" onClick={() => { setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background:"rgba(239,68,68,0.85)", color:"#fff" }}>
                  ✕
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full py-6 rounded-xl flex flex-col items-center gap-2 transition-all"
                style={{ background:"rgba(255,255,255,0.02)", border:"1.5px dashed rgba(255,255,255,0.1)", color:"rgba(120,150,200,0.5)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(59,130,246,0.3)"; e.currentTarget.style.background="rgba(59,130,246,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}>
                <span className="text-2xl">📷</span>
                <span className="text-xs">Rasm yuklash uchun bosing</span>
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm"
            style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171" }}>
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
                <span className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{ borderColor:"rgba(96,165,250,0.3)", borderTopColor:"rgba(96,165,250,0.9)" }} />
                Yuborilmoqda...
              </span>
            : "📤 Ma'lumot yuborish"
          }
        </button>
      </form>
    </div>
  );
}
