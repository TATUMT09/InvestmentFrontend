"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

interface LocationPickerProps {
  onSelect:    (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?:     number;
}

function makeCrosshair() {
  return L.divIcon({
    html: `
      <div style="position:relative;width:44px;height:56px;filter:drop-shadow(0 4px 12px rgba(37,99,235,0.5))">
        <div style="
          width:44px;height:44px;
          background:rgba(37,99,235,0.15);
          border:3px solid #2563eb;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 0 20px rgba(37,99,235,0.4);
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="transform:rotate(45deg);font-size:20px">📍</div>
        </div>
      </div>`,
    className: "",
    iconSize:   [44, 56],
    iconAnchor: [22, 56],
  });
}

function MapController({ onSelect, initialLat, initialLng, markerRef }: {
  onSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  markerRef: React.MutableRefObject<L.Marker | null>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!initialLat || !initialLng) return;
    map.flyTo([initialLat, initialLng], 15, { duration: 1.2 });
    if (markerRef.current) markerRef.current.setLatLng([initialLat, initialLng]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLat, initialLng]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
      const ripple = L.circle([lat, lng], {
        radius: 80, color:"#2563eb", fillColor:"#3b82f6",
        fillOpacity: 0.15, weight: 2, opacity: 0.7,
      }).addTo(map);
      setTimeout(() => map.removeLayer(ripple), 700);
    },
  });

  return null;
}

const LP_CSS = `
.lp-wrap .leaflet-container { background:#f1f5f9 !important; cursor:crosshair !important; }
.lp-wrap .leaflet-control-zoom a {
  background:#ffffff !important; color:#475569 !important; border-color:#e2e8f0 !important;
}
.lp-wrap .leaflet-control-zoom a:hover { background:#f8fafc !important; color:#0f172a !important; }
.lp-wrap .leaflet-control-attribution {
  background:rgba(255,255,255,0.9) !important; color:#94a3b8 !important; font-size:9px !important;
}
.lp-wrap .leaflet-bar { border:1px solid #e2e8f0 !important; border-radius:8px !important; overflow:hidden; }
`;

export default function LocationPicker({ onSelect, initialLat, initialLng, height = 280 }: LocationPickerProps) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = LP_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const hasCoords = !!(initialLat && initialLng);

  return (
    <div>
      <div className="lp-wrap relative rounded-2xl overflow-hidden"
        style={{ height, border:"1px solid #d1d5db", background:"#f1f5f9", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>

        <MapContainer
          center={[initialLat ?? 39.6542, initialLng ?? 66.9597]}
          zoom={13}
          style={{ width:"100%", height:"100%" }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM &copy; CARTO'
            subdomains="abcd"
            maxZoom={19}
          />

          <MapController
            onSelect={onSelect}
            initialLat={initialLat}
            initialLng={initialLng}
            markerRef={markerRef}
          />

          {hasCoords && (
            <Marker
              position={[initialLat!, initialLng!]}
              icon={makeCrosshair()}
              ref={(m) => { markerRef.current = m as any; }}
            />
          )}
        </MapContainer>

        {/* Hint */}
        {!hasCoords && (
          <div className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none z-[1000]">
            <div className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background:"rgba(255,255,255,0.95)", border:"1px solid #d1d5db", color:"#374151", boxShadow:"0 2px 10px rgba(0,0,0,0.1)" }}>
              🗺 Xaritaga bosib lokatsiya tanlang
            </div>
          </div>
        )}

        {/* Coordinate badge */}
        {hasCoords && (
          <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-xl text-xs font-mono"
            style={{ background:"rgba(255,255,255,0.95)", border:"1px solid #bbf7d0", color:"#15803d", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
            📍 {initialLat!.toFixed(5)}, {initialLng!.toFixed(5)}
          </div>
        )}
      </div>

      {hasCoords && (
        <div className="mt-2 flex items-center gap-2 text-xs font-medium" style={{ color:"#15803d" }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"#16a34a" }} />
          Lokatsiya belgilandi: {initialLat!.toFixed(4)}°N, {initialLng!.toFixed(4)}°E
        </div>
      )}
    </div>
  );
}
