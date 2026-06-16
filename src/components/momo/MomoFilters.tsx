"use client";
import { MomoFilters as Filters } from "@/types/momo.types";
import { useMomoStore } from "@/store/momoStore";
import { MOMO_STATUS_LABELS, MOMO_TURI_LABELS } from "@/lib/constants";

const selectStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(170,195,255,0.8)",
  borderRadius: "12px",
  padding: "8px 12px",
  fontSize: "13px",
  outline: "none",
  cursor: "pointer",
};

export default function MomoFilters() {
  const { filters, setFilters, resetFilters } = useMomoStore();
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl"
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
      <select value={filters.status||""} onChange={e=>setFilters({status:(e.target.value as Filters["status"])||undefined})} style={selectStyle}>
        <option value="">Barcha statuslar</option>
        {Object.entries(MOMO_STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
      <select value={filters.turi||""} onChange={e=>setFilters({turi:(e.target.value as Filters["turi"])||undefined})} style={selectStyle}>
        <option value="">Barcha turlar</option>
        {Object.entries(MOMO_TURI_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
      <input type="date" value={filters.sanadan||""} onChange={e=>setFilters({sanadan:e.target.value})} style={selectStyle} />
      <span style={{ color:"rgba(100,130,200,0.4)", fontSize:12 }}>→</span>
      <input type="date" value={filters.sanagacha||""} onChange={e=>setFilters({sanagacha:e.target.value})} style={selectStyle} />
      {hasFilters && (
        <button onClick={resetFilters} className="ml-auto flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all"
          style={{ background:"rgba(244,63,94,0.1)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
          ✕ Tozalash
        </button>
      )}
    </div>
  );
}
