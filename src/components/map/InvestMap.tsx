"use client";
import "leaflet/dist/leaflet.css";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Project } from "@/types/api.types";

/* ── Samarqand border — Yandex Maps API format ── */
import rawGeo from "../../../public/samarqandsh.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawAny = rawGeo as any;
const samarqandGeo = {
  type: "Feature",
  geometry: rawAny?.data?.items?.[0]?.displayGeometry ?? null,
  properties: {},
};

/* ── Fix leaflet default icon paths broken by webpack ── */
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({ iconUrl: "", iconRetinaUrl: "", shadowUrl: "" });
}

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  YANGI:       { color: "#0891b2", label: "Yangi"       },
  JARAYONDA:   { color: "#1d4ed8", label: "Jarayonda"   },
  TUGALLANGAN: { color: "#16a34a", label: "Tugallangan" },
  MUAMMOLI:    { color: "#dc2626", label: "Muammoli"    },
  KECHIKKAN:   { color: "#d97706", label: "Kechikkan"   },
};

const TYPE_EMOJI: Record<string, string> = {
  INVESTITSIYA: "💼",
  QURILISH:     "🏗️",
};

function fmtMoney(v?: number | null) {
  if (!v) return null;
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} mlrd so'm`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(1)} mln so'm`;
  return `${new Intl.NumberFormat("uz-UZ").format(v)} so'm`;
}

function makeDivIcon(project: Project, selected: boolean) {
  const sm    = STATUS_MAP[project.status] ?? { color: "#64748b" };
  const emoji = TYPE_EMOJI[project.type]   ?? "📍";
  const size  = selected ? 52 : 42;
  const glow  = selected ? `box-shadow:0 0 0 3px ${sm.color}55,0 6px 20px ${sm.color}60;` : `box-shadow:0 4px 14px ${sm.color}66;`;
  return L.divIcon({
    className: "",
    iconAnchor: [size / 2, size + 10],
    iconSize:   [size, size + 10],
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:${size}px;height:${size}px;
          background:${sm.color};
          border:3px solid #fff;
          border-radius:${selected ? 14 : 12}px;
          display:flex;align-items:center;justify-content:center;
          font-size:${selected ? 24 : 18}px;
          ${glow}
          transition:all .18s ease;
          cursor:pointer;
        ">${emoji}</div>
        <div style="
          width:0;height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:10px solid ${sm.color};
          margin-top:-1px;
        "></div>
      </div>`,
  });
}

function makeLocationIcon() {
  return L.divIcon({
    className: "",
    iconAnchor: [18, 18],
    iconSize:   [36, 36],
    html: `<div style="
      width:36px;height:36px;
      background:rgba(59,130,246,0.18);
      border:2px solid #3b82f6;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="width:14px;height:14px;background:#3b82f6;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px #3b82f688;"></div>
    </div>`,
  });
}

/* ── Location button — must be inside MapContainer ── */
function LocateControl() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1.4 });
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [map]);

  return (
    <div
      style={{
        position: "absolute", bottom: 90, right: 10, zIndex: 1000,
        display: "flex", flexDirection: "column", gap: 6,
      }}
      className="leaflet-control"
    >
      <button
        onClick={locate}
        title="Joylashuvimni aniqlash"
        style={{
          width: 38, height: 38,
          background: "#fff",
          border: "2px solid rgba(0,0,0,0.15)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: loading ? "wait" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          fontSize: 18,
          transition: "all .15s",
        }}
      >
        {loading ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#3b82f6" strokeWidth="2.5"
            style={{ animation: "spin 1s linear infinite" }}>
            <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#1d4ed8" strokeWidth="2">
            <circle cx="12" cy="12" r="3" fill="#1d4ed8" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ── Main export ── */
const MAP_CENTER: [number, number] = [39.660431, 66.662297]; // Pastdargom tumani markazi

export default function InvestMap({ projects = [] }: { projects?: Project[] }) {
  const router   = useRouter();
  const [selected, setSelected] = useState<Project | null>(null);
  const [userPos,  setUserPos]  = useState<[number, number] | null>(null);

  /* watch geolocation passively */
  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      undefined,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const validProjects = projects.filter(p => p.latitude && p.longitude);

  /* GeoJSON style */
  const borderStyle = {
    color:       "#22c55e",
    weight:      2.5,
    opacity:     0.9,
    fillColor:   "#22c55e",
    fillOpacity: 0.18,
    dashArray:   "6 4",
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Satellite base layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          maxNativeZoom={19}
        />
        {/* Labels on top of satellite */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.8}
        />

        {/* Pastdargom tuman chegarasi */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <GeoJSON data={samarqandGeo as any} style={() => borderStyle} />

        {/* Zoom control — top right */}
        <div className="leaflet-top leaflet-right" style={{ top: 10, right: 10 }}>
          <div className="leaflet-control leaflet-bar" />
        </div>

        {/* Custom zoom buttons */}
        <ZoomButtons />

        {/* Location button */}
        <LocateControl />

        {/* User position marker */}
        {userPos && (
          <Marker position={userPos} icon={makeLocationIcon()} zIndexOffset={2000}>
            <Popup closeButton={false}>
              <div style={{ fontFamily: "system-ui", fontSize: 12, color: "#1e293b", padding: "2px 0" }}>
                <strong>📍 Sizning joylashuvingiz</strong>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 11 }}>
                  {userPos[0].toFixed(5)}, {userPos[1].toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Project markers */}
        {validProjects.map(p => {
          const isSelected = selected?.id === p.id;
          const sm    = STATUS_MAP[p.status] ?? { color: "#64748b", label: p.status };
          const emoji = TYPE_EMOJI[p.type]   ?? "📍";
          const loc   = [p.district, p.region].filter(Boolean).join(", ") || p.address || "";
          const money = fmtMoney(p.allocatedMoney);
          return (
            <Marker
              key={p.id}
              position={[p.latitude!, p.longitude!]}
              icon={makeDivIcon(p, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => setSelected(isSelected ? null : p),
              }}
            >
              <Popup
                closeButton={false}
                autoPan={false}
                offset={[0, -52]}
                className="invest-popup"
              >
                <div style={{
                  fontFamily: "system-ui, sans-serif",
                  minWidth: 210, maxWidth: 270,
                  fontSize: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{emoji}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 0", fontFamily: "monospace" }}>#{p.id}</p>
                    </div>
                  </div>
                  {p.investorName && <p style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>🏢 {p.investorName}</p>}
                  {loc           && <p style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>📍 {loc}</p>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: `${sm.color}18`, border: `1.5px solid ${sm.color}40`, color: sm.color,
                    }}>{sm.label}</span>
                    {money && <span style={{
                      padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: "#eff6ff", border: "1.5px solid #bfdbfe", color: "#1d4ed8",
                    }}>💰 {money}</span>}
                  </div>
                  {p.ownerFullName && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 7 }}>👤 {p.ownerFullName}</p>}
                  <button
                    onClick={() => router.push(`/investitsiya/obyektlar/${p.id}`)}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      padding: "7px 0",
                      borderRadius: 10,
                      border: "1.5px solid #bbf7d0",
                      background: "#f0fdf4",
                      color: "#16a34a",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#dcfce7")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#f0fdf4")}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Batafsil
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Attribution */}
      <div style={{
        position: "absolute", bottom: 4, right: 8, zIndex: 999,
        fontSize: 10, color: "rgba(255,255,255,0.7)",
        pointerEvents: "none",
      }}>
        © Esri, Maxar, Earthstar Geographics
      </div>
    </div>
  );
}

/* ── Custom zoom buttons ── */
function ZoomButtons() {
  const map = useMap();
  return (
    <div style={{
      position: "absolute", top: 10, right: 10, zIndex: 1000,
      display: "flex", flexDirection: "column", gap: 2,
    }}>
      {[
        { label: "+", action: () => map.zoomIn()  },
        { label: "−", action: () => map.zoomOut() },
      ].map(({ label, action }) => (
        <button key={label} onClick={action}
          style={{
            width: 38, height: 38,
            background: "#fff",
            border: "2px solid rgba(0,0,0,0.15)",
            borderRadius: label === "+" ? "8px 8px 0 0" : "0 0 8px 8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 300,
            cursor: "pointer",
            color: "#374151",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}>
          {label}
        </button>
      ))}
    </div>
  );
}
