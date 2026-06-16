"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { getFiles, uploadFile } from "@/services/fileService";
import type { FileItem } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const N="#0d1f3c", G="#c9a84c", CD="#f0ead8", CDD="#e4dbc8", T2="#8896b0", T3="#b0bdd4";

const TYPE_CFG: Record<string, { color: string; bg: string; border: string }> = {
  IMAGE:    { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
  DOCUMENT: { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  VIDEO:    { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};
const typeCfg = (t: string) => TYPE_CFG[t] ?? { color: "#475569", bg: "#f8fafc", border: "#e2e8f0" };

function getExt(fileName: string) { return fileName.split(".").pop()?.toUpperCase() ?? "FILE"; }
function formatSize(bytes: number) {
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const TYPE_OPTIONS = ["Barcha turlar", "IMAGE", "DOCUMENT", "VIDEO"];
const TYPE_LABELS: Record<string, string> = { IMAGE: "Rasm", DOCUMENT: "Hujjat", VIDEO: "Video" };

const selBase = "px-3 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer appearance-none";
const selStyle = { background: "#fff", border: `1.5px solid ${CDD}`, color: N };

export default function HujjatlarPage() {
  const [files,        setFiles]        = useState<FileItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("Barcha turlar");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [uploadTitle,  setUploadTitle]  = useState("");
  const [projectId,    setProjectId]    = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError,  setUploadError]  = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try   { setFiles(await getFiles()); }
    catch { setFiles([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => files.filter(f => {
    const t = typeFilter === "Barcha turlar" || f.fileType === typeFilter;
    const s = !search || f.title.toLowerCase().includes(search.toLowerCase()) ||
              f.fileName.toLowerCase().includes(search.toLowerCase());
    return t && s;
  }), [files, typeFilter, search]);

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) { setUploadError("Fayl va sarlavha majburiy"); return; }
    setUploading(true); setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("title", uploadTitle.trim());
      if (projectId.trim()) fd.append("projectId", projectId.trim());
      const newFile = await uploadFile(fd);
      setFiles(prev => [newFile, ...prev]);
      closeModal();
    } catch { setUploadError("Yuklashda xatolik yuz berdi"); }
    finally  { setUploading(false); }
  };

  const closeModal = () => {
    setModalOpen(false); setUploadTitle(""); setProjectId("");
    setSelectedFile(null); setUploadError("");
  };

  const inpStyle = { background: CD, border: `1.5px solid ${CDD}`, color: N };

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight: "calc(100vh - 60px)", background: "#faf7f0" }}>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: `rgba(13,31,60,0.4)`, backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-[440px] rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: `1px solid ${CDD}`, boxShadow: `0 20px 60px rgba(13,31,60,0.15)` }}>
            {/* Top strip */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${N} 0%, ${G} 100%)` }} />

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${CDD}` }}>
              <h2 className="text-base font-bold" style={{ color: N }}>Fayl yuklash</h2>
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
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>SARLAVHA *</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Fayl nomi..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={inpStyle}
                  onFocus={e => { e.target.style.borderColor = N; }}
                  onBlur={e  => { e.target.style.borderColor = CDD; }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>LOYIHA ID (ixtiyoriy)</label>
                <input value={projectId} onChange={e => setProjectId(e.target.value)} type="number"
                  placeholder="Masalan: 1"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={inpStyle}
                  onFocus={e => { e.target.style.borderColor = N; }}
                  onBlur={e  => { e.target.style.borderColor = CDD; }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest mb-1.5" style={{ color: T2 }}>FAYL *</label>
                <div className="w-full rounded-xl px-3 py-3 text-sm cursor-pointer flex items-center gap-3 transition-all"
                  style={{ ...inpStyle, border: selectedFile ? `1.5px solid ${N}` : `1.5px dashed ${CDD}` }}
                  onClick={() => fileRef.current?.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T3} strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={{ color: selectedFile ? N : T3 }}>
                    {selectedFile ? selectedFile.name : "Fayl tanlash..."}
                  </span>
                  {selectedFile && (
                    <span className="ml-auto text-xs font-medium" style={{ color: T2 }}>
                      {formatSize(selectedFile.size)}
                    </span>
                  )}
                </div>
                <input ref={fileRef} type="file" className="hidden"
                  onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
              </div>
              {uploadError && (
                <p className="text-xs font-medium px-3 py-2.5 rounded-xl"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                  {uploadError}
                </p>
              )}
            </div>

            <div className="px-6 py-4 flex gap-3" style={{ borderTop: `1px solid ${CDD}` }}>
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: CD, color: T2, border: `1px solid ${CDD}` }}
                onMouseEnter={e => (e.currentTarget.style.background = CDD)}
                onMouseLeave={e => (e.currentTarget.style.background = CD)}>
                Bekor qilish
              </button>
              <button onClick={handleUpload} disabled={uploading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: uploading ? `${N}99` : N, opacity: uploading ? 0.8 : 1 }}>
                {uploading ? "Yuklanmoqda..." : "Yuklash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 flex items-start justify-between"
        style={{ background: "#fff", borderBottom: `1px solid ${CDD}`, boxShadow: `0 1px 0 ${CDD}` }}>
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-1.5"
            style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8" }}>
            HUJJATLAR
          </span>
          <h1 className="text-lg font-bold" style={{ color: N }}>Hujjatlar</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T2 }}>Barcha hujjatlar ro&apos;yxati</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-1 transition-all"
          style={{ background: N }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Hujjat yuklash
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-2 flex-shrink-0">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selBase} style={selStyle}>
          {TYPE_OPTIONS.map(v => (
            <option key={v} value={v}>{v === "Barcha turlar" ? v : (TYPE_LABELS[v] ?? v)}</option>
          ))}
        </select>
        <div className="relative flex-1 max-w-[240px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke={T3} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all"
            style={{ background: "#fff", border: `1.5px solid ${CDD}`, color: N }}
            onFocus={e => { e.target.style.borderColor = N; e.target.style.boxShadow = `0 0 0 3px ${N}10`; }}
            onBlur={e  => { e.target.style.borderColor = CDD; e.target.style.boxShadow = "none"; }} />
        </div>
        <span className="ml-auto text-xs font-medium" style={{ color: T2 }}>{filtered.length} ta</span>
      </div>

      {/* Grid */}
      <div className="px-6 pb-6 flex-1">
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl p-4 h-[148px] animate-pulse"
                style={{ background: "#fff", border: `1px solid ${CDD}` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: CD }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T3} strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: T2 }}>Hujjatlar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map(f => {
              const cfg  = typeCfg(f.fileType);
              const ext  = getExt(f.fileName);
              const href = `${BASE_URL}${f.fileUrl}`;
              return (
                <div key={f.id} className="rounded-2xl p-4 relative group transition-all"
                  style={{ background: "#fff", border: `1px solid ${CDD}`, boxShadow: `0 1px 3px ${N}06` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = cfg.color + "55")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = CDD)}>

                  <a href={href} target="_blank" rel="noreferrer"
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: CD, color: T2 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>

                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <span className="text-xs font-bold" style={{ color: cfg.color }}>{ext}</span>
                  </div>

                  <p className="text-sm font-semibold leading-snug mb-1 pr-6" style={{ color: N }}>
                    {f.title}
                  </p>
                  <p className="text-[11px] mb-3 truncate" style={{ color: T3 }}>
                    {f.fileName}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-lg font-semibold"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {TYPE_LABELS[f.fileType] ?? f.fileType}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: T3 }}>
                      {formatSize(f.size)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
