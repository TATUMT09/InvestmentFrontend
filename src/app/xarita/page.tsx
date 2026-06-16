"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import StatusBadge from "@/components/shared/StatusBadge";
import { MomoStatus } from "@/types/momo.types";
import type { MapPin } from "@/components/map/LeafletMap";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl flex items-center justify-center"
      style={{ height:520, background:"#f1f5f9", border:"1px solid #e2e8f0" }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor:"#e2e8f0", borderTopColor:"#3b82f6" }} />
        <p className="text-sm font-medium" style={{ color:"#64748b" }}>Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

const ALL_PINS: MapPin[] = [
  { id:"M-1042", lat:39.6546, lng:66.9762, tur:"Elektr",  icon:"⚡", color:"#f59e0b", manzil:"Registon ko'chasi, 12-uy",  holat:"korib_chiqilmoqda", sana:"07.04.2026" },
  { id:"M-1039", lat:39.6619, lng:66.9715, tur:"Suv",     icon:"💧", color:"#06b6d4", manzil:"Siob bozori yaqini",        holat:"bajarilmoqda",      sana:"06.04.2026" },
  { id:"M-1035", lat:39.6700, lng:66.9838, tur:"Gaz",     icon:"🔥", color:"#f97316", manzil:"Aeroport yo'li, 3-mavze",   holat:"yuborildi",         sana:"05.04.2026" },
  { id:"M-1029", lat:39.6450, lng:66.9500, tur:"Yo'l",    icon:"🛣️", color:"#64748b", manzil:"Buyuk ipak yo'li ko'chasi", holat:"bajarildi",         sana:"03.04.2026" },
  { id:"M-1021", lat:39.6350, lng:66.9650, tur:"Quvur",   icon:"🔧", color:"#8b5cf6", manzil:"Pastdarg'om magistrali",    holat:"bajarildi",         sana:"01.04.2026" },
  { id:"M-1018", lat:39.6580, lng:66.9400, tur:"Elektr",  icon:"⚡", color:"#f59e0b", manzil:"Shiroq tumani, 5-kvartal",  holat:"yuborildi",         sana:"31.03.2026" },
  { id:"M-1015", lat:39.6750, lng:66.9580, tur:"Suv",     icon:"💧", color:"#06b6d4", manzil:"Bog'ishamol ko'chasi",      holat:"bajarilmoqda",      sana:"30.03.2026" },
  { id:"M-1010", lat:39.6480, lng:67.0100, tur:"Gaz",     icon:"🔥", color:"#f97316", manzil:"Jomboy yo'nalishi",         holat:"korib_chiqilmoqda", sana:"29.03.2026" },
  { id:"M-1005", lat:39.6900, lng:66.9300, tur:"Yo'l",    icon:"🛣️", color:"#64748b", manzil:"Dahbed tumani",             holat:"bajarildi",         sana:"28.03.2026" },
];

const TUR_FILTERS = [
  { key:"barchasi", label:"Barchasi", icon:"🗺️" },
  { key:"Elektr",   label:"Elektr",   icon:"⚡" },
  { key:"Suv",      label:"Suv",      icon:"💧" },
  { key:"Gaz",      label:"Gaz",      icon:"🔥" },
  { key:"Yo'l",     label:"Yo'l",     icon:"🛣️" },
  { key:"Quvur",    label:"Quvur",    icon:"🔧" },
];

const STATUS_FILTERS: Array<{ key: MomoStatus|"barchasi"; label:string }> = [
  { key:"barchasi",          label:"Barchasi" },
  { key:"yuborildi",         label:"Yangi" },
  { key:"korib_chiqilmoqda", label:"Ko'rilmoqda" },
  { key:"bajarilmoqda",      label:"Jarayonda" },
  { key:"bajarildi",         label:"Bajarildi" },
];

const STATUS_DOT: Record<MomoStatus, string> = {
  yuborildi:"#64748b", korib_chiqilmoqda:"#f59e0b",
  bajarilmoqda:"#3b82f6", bajarildi:"#10b981",
};

export default function XaritaPage() {
  const [turFilter, setTurFilter]       = useState("barchasi");
  const [statusFilter, setStatusFilter] = useState<MomoStatus|"barchasi">("barchasi");
  const [selected, setSelected]         = useState<MapPin | null>(null);

  const filtered = ALL_PINS.filter(p => {
    const matchT = turFilter    === "barchasi" || p.tur   === turFilter;
    const matchS = statusFilter === "barchasi" || p.holat === statusFilter;
    return matchT && matchS;
  });

  const counts = {
    barchasi:          ALL_PINS.length,
    yuborildi:         ALL_PINS.filter(p=>p.holat==="yuborildi").length,
    korib_chiqilmoqda: ALL_PINS.filter(p=>p.holat==="korib_chiqilmoqda").length,
    bajarilmoqda:      ALL_PINS.filter(p=>p.holat==="bajarilmoqda").length,
    bajarildi:         ALL_PINS.filter(p=>p.holat==="bajarildi").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"#0f172a" }}>Xarita</h1>
        <p className="text-sm mt-1" style={{ color:"#64748b" }}>
          Samarqand bo'yicha momolar joylashuvi — real vaqt
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {TUR_FILTERS.map(f => (
          <button key={f.key} onClick={()=>setTurFilter(f.key)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all font-medium"
            style={{
              background: turFilter===f.key ? "#eff6ff" : "#ffffff",
              border:`1px solid ${turFilter===f.key ? "#93c5fd" : "#e2e8f0"}`,
              color: turFilter===f.key ? "#1d4ed8" : "#374151",
              boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
            }}>
            <span>{f.icon}</span> {f.label}
          </button>
        ))}
        <div className="w-px mx-1 self-stretch" style={{ background:"#e2e8f0" }} />
        {STATUS_FILTERS.map(f => (
          <button key={f.key} onClick={()=>setStatusFilter(f.key as any)}
            className="text-sm px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-medium"
            style={{
              background: statusFilter===f.key ? "#f0fdf4" : "#ffffff",
              border:`1px solid ${statusFilter===f.key ? "#86efac" : "#e2e8f0"}`,
              color: statusFilter===f.key ? "#15803d" : "#374151",
              boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
            }}>
            {f.key!=="barchasi" && (
              <span className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: STATUS_DOT[f.key as MomoStatus] }} />
            )}
            {f.label}
            {f.key in counts && (
              <span className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                style={{ background: statusFilter===f.key ? "#dcfce7" : "#f1f5f9", color: statusFilter===f.key ? "#15803d" : "#64748b" }}>
                {counts[f.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <LeafletMap
            pins={filtered}
            height={520}
            onPinClick={setSelected}
          />
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-3">
          {/* Selected detail */}
          {selected ? (
            <div className="p-4 rounded-2xl"
              style={{ background:"#ffffff", border:`1.5px solid ${selected.color}40`, boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background:`${selected.color}18`, border:`1.5px solid ${selected.color}40` }}>
                  {selected.icon}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color:"#0f172a" }}>{selected.tur} momosi</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color:"#94a3b8" }}>{selected.id}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between gap-2">
                  <span className="font-medium" style={{ color:"#64748b" }}>Manzil</span>
                  <span className="text-right font-semibold" style={{ color:"#1e293b" }}>{selected.manzil}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color:"#64748b" }}>Holat</span>
                  <StatusBadge status={selected.holat} />
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-medium" style={{ color:"#64748b" }}>Koordinata</span>
                  <span className="font-mono text-xs" style={{ color:"#475569" }}>
                    {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                  </span>
                </div>
                {selected.sana && (
                  <div className="flex justify-between">
                    <span className="font-medium" style={{ color:"#64748b" }}>Sana</span>
                    <span className="font-medium" style={{ color:"#1e293b" }}>{selected.sana}</span>
                  </div>
                )}
              </div>
              <button onClick={()=>setSelected(null)}
                className="w-full py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ background:"#f8fafc", border:"1px solid #e2e8f0", color:"#64748b" }}
                onMouseEnter={e=>(e.currentTarget.style.background="#f1f5f9")}
                onMouseLeave={e=>(e.currentTarget.style.background="#f8fafc")}>
                Yopish ×
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl text-center"
              style={{ background:"#ffffff", border:"1px solid #e2e8f0", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm font-medium" style={{ color:"#64748b" }}>Marker bosib ma'lumot ko'ring</p>
            </div>
          )}

          {/* List */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background:"#ffffff", border:"1px solid #e2e8f0", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
            <div className="px-3 py-2.5 border-b" style={{ borderColor:"#f1f5f9" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"#64748b" }}>
                Ro'yxat ({filtered.length})
              </p>
            </div>
            <div className="overflow-y-auto"
              style={{ maxHeight:340, scrollbarWidth:"thin", scrollbarColor:"#e2e8f0 transparent" }}>
              {filtered.map(p => (
                <button key={p.id} onClick={()=>setSelected(p)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all border-b"
                  style={{
                    borderColor:"#f8fafc",
                    background: selected?.id===p.id ? "#eff6ff" : "transparent",
                  }}
                  onMouseEnter={e=>{ if(selected?.id!==p.id) e.currentTarget.style.background="#f8fafc"; }}
                  onMouseLeave={e=>{ if(selected?.id!==p.id) e.currentTarget.style.background="transparent"; }}>
                  <span className="text-base flex-shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color:"#1e293b" }}>{p.manzil}</p>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color:"#94a3b8" }}>{p.id}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: STATUS_DOT[p.holat] }} />
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-center py-6 font-medium" style={{ color:"#94a3b8" }}>
                  Hech narsa topilmadi
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
