"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MomoStatus } from "@/types/momo.types";

/* ── Types ─────────────────────────────────────────────── */
export interface MapPin {
  id:     string;
  lat:    number;
  lng:    number;
  tur:    string;
  icon:   string;
  color:  string;
  manzil: string;
  holat:  MomoStatus;
  sana?:  string;
}

interface LeafletMapProps {
  pins?:        MapPin[];
  height?:      number;
  zoom?:        number;
  center?:      [number, number];
  showBorders?: boolean;
  onPinClick?:  (pin: MapPin) => void;
}

/* ── Constants ──────────────────────────────────────────── */
const STATUS_COLORS: Record<MomoStatus, string> = {
  yuborildi:         "#64748b",
  korib_chiqilmoqda: "#f59e0b",
  bajarilmoqda:      "#3b82f6",
  bajarildi:         "#10b981",
};
const STATUS_LABELS: Record<MomoStatus, string> = {
  yuborildi:         "Yuborildi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  bajarilmoqda:      "Bajarilmoqda",
  bajarildi:         "Bajarildi",
};

/* Samarqand markazi */
const SAMARQAND_CENTER: [number, number] = [39.6542, 66.9597];
const SAMARQAND_ZOOM = 12;

export const DEFAULT_PINS: MapPin[] = [
  { id:"M-1042", lat:39.6546, lng:66.9762, tur:"Elektr",  icon:"⚡", color:"#f59e0b", manzil:"Registon ko'chasi, 12-uy",   holat:"korib_chiqilmoqda", sana:"07.04.2026" },
  { id:"M-1039", lat:39.6619, lng:66.9715, tur:"Suv",     icon:"💧", color:"#06b6d4", manzil:"Siob bozori yaqini",         holat:"bajarilmoqda",      sana:"06.04.2026" },
  { id:"M-1035", lat:39.6700, lng:66.9838, tur:"Gaz",     icon:"🔥", color:"#f97316", manzil:"Aeroport yo'li, 3-mavze",    holat:"yuborildi",         sana:"05.04.2026" },
  { id:"M-1029", lat:39.6450, lng:66.9500, tur:"Yo'l",    icon:"🛣️", color:"#64748b", manzil:"Buyuk ipak yo'li ko'chasi",  holat:"bajarildi",         sana:"03.04.2026" },
  { id:"M-1021", lat:39.6350, lng:66.9650, tur:"Quvur",   icon:"🔧", color:"#8b5cf6", manzil:"Pastdarg'om magistrali",     holat:"bajarildi",         sana:"01.04.2026" },
  { id:"M-1018", lat:39.6580, lng:66.9400, tur:"Elektr",  icon:"⚡", color:"#f59e0b", manzil:"Shiroq tumani, 5-kvartal",   holat:"yuborildi",         sana:"31.03.2026" },
  { id:"M-1015", lat:39.6750, lng:66.9580, tur:"Suv",     icon:"💧", color:"#06b6d4", manzil:"Bog'ishamol ko'chasi",       holat:"bajarilmoqda",      sana:"30.03.2026" },
  { id:"M-1010", lat:39.6480, lng:67.0100, tur:"Gaz",     icon:"🔥", color:"#f97316", manzil:"Jomboy yo'nalishi",          holat:"korib_chiqilmoqda", sana:"29.03.2026" },
  { id:"M-1005", lat:39.6900, lng:66.9300, tur:"Yo'l",    icon:"🛣️", color:"#64748b", manzil:"Dahbed tumani",              holat:"bajarildi",         sana:"28.03.2026" },
];

/* ── Marker icon ────────────────────────────────────────── */
function makeIcon(color: string, emoji: string, statusColor: string) {
  return L.divIcon({
    html: `
      <div style="position:relative;width:40px;height:52px;filter:drop-shadow(0 3px 10px ${color}60)">
        <div style="
          width:40px;height:40px;
          background:${color};
          border:2.5px solid #fff;
          border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;
          box-shadow:0 2px 12px ${color}50,0 0 0 3px ${color}20;
        ">${emoji}</div>
        <div style="
          position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:6px solid transparent;border-right:6px solid transparent;
          border-top:12px solid ${color};
        "></div>
        <div style="
          position:absolute;top:-5px;right:-5px;
          width:13px;height:13px;border-radius:50%;
          background:${statusColor};border:2.5px solid #fff;
          box-shadow:0 0 6px ${statusColor}80;
        "></div>
      </div>`,
    className: "",
    iconSize:   [40, 52],
    iconAnchor: [20, 52],
    popupAnchor:[0, -56],
  });
}

/* ── GeoJSON Samarqand boundary ─────────────────────────── */
function SamarqandBorder({ pins, onTuman }: { pins: MapPin[]; onTuman:(n:string|null)=>void }) {
  const map = useMap();

  useEffect(() => {
    let layer: L.GeoJSON | null = null;

    fetch("/samarqandsh.json")
      .then(r => r.json())
      .then(data => {
        layer = L.geoJSON(data, {
          style: {
            color: "#16a34a",
            weight: 3,
            opacity: 0.9,
            fillColor: "#22c55e",
            fillOpacity: 0.08,
            dashArray: undefined,
          },
        });

        layer.on("mouseover", (e: any) => {
          e.target.setStyle({ weight: 4, fillOpacity: 0.18, opacity: 1 });
          onTuman("Samarqand shahri");
        });
        layer.on("mouseout", (e: any) => {
          e.target.setStyle({ weight: 3, fillOpacity: 0.08, opacity: 0.9 });
          onTuman(null);
        });
        layer.on("click", (e: any) => {
          const b = e.target.getBounds();
          const cnt = pins.filter(p => b.contains(L.latLng(p.lat, p.lng))).length;

          L.popup({ closeButton: true, maxWidth: 240 })
            .setLatLng(e.latlng)
            .setContent(`
              <div style="font-family:system-ui,sans-serif">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                  <div style="width:10px;height:10px;border-radius:50%;background:#16a34a;box-shadow:0 0 6px #22c55e;flex-shrink:0"></div>
                  <p style="font-size:14px;font-weight:700;color:#1e293b;margin:0">Samarqand shahri</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
                  <div style="padding:8px 10px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0">
                    <p style="font-size:10px;color:#64748b;margin:0 0 3px">Viloyat</p>
                    <p style="font-size:13px;font-weight:700;color:#16a34a;margin:0">Samarqand</p>
                  </div>
                  <div style="padding:8px 10px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0">
                    <p style="font-size:10px;color:#64748b;margin:0 0 3px">Aholi</p>
                    <p style="font-size:13px;font-weight:700;color:#0f172a;margin:0">~700 000</p>
                  </div>
                  <div style="grid-column:span 2;padding:8px 10px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe">
                    <p style="font-size:10px;color:#64748b;margin:0 0 3px">Hududdagi momolar</p>
                    <p style="font-size:16px;font-weight:700;color:#2563eb;margin:0">${cnt} <span style="font-size:11px;font-weight:400;color:#93c5fd">ta</span></p>
                  </div>
                </div>
              </div>`)
            .openOn(map);
        });

        layer.addTo(map);

        /* City label */
        const c = layer.getBounds().getCenter();
        L.marker(c, {
          icon: L.divIcon({
            html: `<span style="font-size:12px;font-weight:800;color:#15803d;background:rgba(255,255,255,0.85);padding:2px 7px;border-radius:6px;border:1px solid #bbf7d0;white-space:nowrap;letter-spacing:0.3px;box-shadow:0 1px 4px rgba(0,0,0,0.12)">Samarqand shahri</span>`,
            className: "",
            iconAnchor: [55, 10],
          }),
          interactive: false,
          zIndexOffset: -200,
        }).addTo(map);
      });

    return () => { if (layer) map.removeLayer(layer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

/* ── Map CSS (light theme) ──────────────────────────────── */
const MAP_CSS = `
.leaflet-container { background:#f1f5f9 !important; font-family:system-ui,sans-serif; }
.leaflet-popup-content-wrapper {
  background:#ffffff !important;
  border:1px solid #e2e8f0 !important;
  border-radius:14px !important;
  box-shadow:0 8px 30px rgba(0,0,0,0.12) !important;
  color:#1e293b !important;
  padding:0 !important;
}
.leaflet-popup-content { margin:0 !important; padding:14px 16px !important; }
.leaflet-popup-tip-container { display:none !important; }
.leaflet-popup-close-button {
  color:#94a3b8 !important;
  top:8px !important; right:10px !important; font-size:18px !important;
}
.leaflet-popup-close-button:hover { color:#475569 !important; }
.leaflet-control-zoom a {
  background:#ffffff !important; color:#475569 !important;
  border-color:#e2e8f0 !important;
}
.leaflet-control-zoom a:hover { background:#f8fafc !important; color:#0f172a !important; }
.leaflet-control-attribution {
  background:rgba(255,255,255,0.9) !important;
  color:#94a3b8 !important; font-size:10px !important;
}
.leaflet-control-attribution a { color:#3b82f6 !important; }
.leaflet-bar { border:1px solid #e2e8f0 !important; border-radius:10px !important; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08) !important; }
`;

/* ── Main component ─────────────────────────────────────── */
export default function LeafletMap({
  pins,
  height = 520,
  zoom: initZoom = SAMARQAND_ZOOM,
  center: initCenter = SAMARQAND_CENTER,
  showBorders = true,
  onPinClick,
}: LeafletMapProps) {
  const [activeTuman, setActiveTuman] = useState<string | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = MAP_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleTuman = useCallback((n: string | null) => setActiveTuman(n), []);
  const displayPins = pins ?? DEFAULT_PINS;

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ height, border:"1px solid #e2e8f0", background:"#f1f5f9", boxShadow:"0 2px 20px rgba(0,0,0,0.08)" }}>

      <MapContainer
        center={initCenter}
        zoom={initZoom}
        style={{ width:"100%", height:"100%" }}
        zoomControl={true}
        attributionControl={true}
      >
        {/* CartoDB Voyager — yorqin, tushunarli tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Samarqand chegarasi */}
        {showBorders && (
          <SamarqandBorder pins={displayPins} onTuman={handleTuman} />
        )}

        {/* Pinlar */}
        {displayPins.map(pin => {
          const statusColor = STATUS_COLORS[pin.holat] ?? "#64748b";
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={makeIcon(pin.color, pin.icon, statusColor)}
              eventHandlers={{ click: () => onPinClick?.(pin) }}
            >
              <Popup maxWidth={260}>
                <div style={{ fontFamily:"system-ui,sans-serif", minWidth:200 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>{pin.icon}</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#0f172a", margin:0 }}>{pin.tur} momosi</p>
                      <p style={{ fontSize:11, color:"#94a3b8", margin:"2px 0 0", fontFamily:"monospace" }}>{pin.id}</p>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"#475569", marginBottom:8 }}>📍 {pin.manzil}</div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, background:`${statusColor}18`, border:`1.5px solid ${statusColor}40` }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:statusColor, display:"inline-block" }} />
                    <span style={{ fontSize:11, fontWeight:600, color:statusColor }}>{STATUS_LABELS[pin.holat]}</span>
                  </div>
                  {pin.sana && <div style={{ fontSize:11, color:"#94a3b8", marginTop:6 }}>🕐 {pin.sana}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Active tuman tooltip */}
      {activeTuman && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 rounded-xl text-xs font-bold pointer-events-none"
          style={{ background:"rgba(255,255,255,0.95)", border:"1px solid #bbf7d0", color:"#15803d", backdropFilter:"blur(8px)", boxShadow:"0 2px 12px rgba(0,0,0,0.1)", whiteSpace:"nowrap" }}>
          📍 {activeTuman}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl space-y-1.5"
        style={{ background:"rgba(255,255,255,0.96)", border:"1px solid #e2e8f0", boxShadow:"0 2px 16px rgba(0,0,0,0.1)", backdropFilter:"blur(8px)" }}>
        {(Object.entries(STATUS_COLORS) as [MomoStatus, string][]).map(([k, c]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:c }} />
            <span className="text-xs font-medium" style={{ color:"#374151" }}>{STATUS_LABELS[k]}</span>
          </div>
        ))}
        {showBorders && (
          <>
            <div className="h-px" style={{ background:"#e5e7eb" }} />
            <div className="flex items-center gap-2">
              <span className="w-6 inline-block" style={{ height:2.5, background:"#16a34a", display:"inline-block", borderRadius:2 }} />
              <span className="text-xs font-medium" style={{ color:"#374151" }}>Shahar chegarasi</span>
            </div>
          </>
        )}
      </div>

      {/* Pin count */}
      <div className="absolute top-3 right-3 z-[1000] px-2.5 py-1.5 rounded-xl text-xs font-bold"
        style={{ background:"rgba(255,255,255,0.95)", border:"1px solid #e2e8f0", color:"#1d4ed8", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
        📍 {displayPins.length} ta momo
      </div>
    </div>
  );
}
