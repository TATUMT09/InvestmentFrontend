// Toshkent shahar tumanlarining taxminiy GeoJSON chegaralari
// Koordinatalar: [lng, lat] (GeoJSON standart)

export interface TumanProperties {
  nomi:     string;
  nomi_uz:  string;
  color:    string;
  aholi:    string;
  maydoni:  string;
}

export const TOSHKENT_TUMANLAR: GeoJSON.FeatureCollection<GeoJSON.Polygon, TumanProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nomi:"Yunusobod", nomi_uz:"Yunusobod tumani", color:"#3b82f6", aholi:"302 000", maydoni:"35 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.280, 41.310], [69.330, 41.310], [69.360, 41.320],
          [69.370, 41.355], [69.340, 41.380], [69.290, 41.375],
          [69.270, 41.360], [69.265, 41.335], [69.280, 41.310],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Mirzo Ulug'bek", nomi_uz:"Mirzo Ulug'bek tumani", color:"#8b5cf6", aholi:"258 000", maydoni:"42 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.330, 41.275], [69.390, 41.275], [69.405, 41.285],
          [69.400, 41.330], [69.370, 41.355], [69.330, 41.310],
          [69.310, 41.295], [69.330, 41.275],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Yashnobod", nomi_uz:"Yashnobod tumani", color:"#06b6d4", aholi:"218 000", maydoni:"38 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.295, 41.245], [69.370, 41.245], [69.395, 41.255],
          [69.405, 41.285], [69.390, 41.275], [69.330, 41.275],
          [69.300, 41.265], [69.285, 41.255], [69.295, 41.245],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Sergeli", nomi_uz:"Sergeli tumani", color:"#10b981", aholi:"316 000", maydoni:"78 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.185, 41.230], [69.295, 41.230], [69.295, 41.245],
          [69.285, 41.255], [69.300, 41.265], [69.285, 41.280],
          [69.250, 41.285], [69.215, 41.280], [69.185, 41.265],
          [69.185, 41.230],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Bektemir", nomi_uz:"Bektemir tumani", color:"#f43f5e", aholi:"47 000", maydoni:"29 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.295, 41.230], [69.395, 41.230], [69.405, 41.248],
          [69.395, 41.255], [69.370, 41.245], [69.295, 41.245],
          [69.295, 41.230],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Chilonzor", nomi_uz:"Chilonzor tumani", color:"#f59e0b", aholi:"312 000", maydoni:"30 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.185, 41.270], [69.215, 41.280], [69.250, 41.285],
          [69.260, 41.300], [69.240, 41.318], [69.215, 41.320],
          [69.190, 41.310], [69.183, 41.290], [69.185, 41.270],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Uchtepa", nomi_uz:"Uchtepa tumani", color:"#f97316", aholi:"290 000", maydoni:"33 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.183, 41.290], [69.190, 41.310], [69.215, 41.320],
          [69.218, 41.345], [69.200, 41.355], [69.180, 41.350],
          [69.170, 41.325], [69.175, 41.300], [69.183, 41.290],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Olmazor", nomi_uz:"Olmazor tumani", color:"#84cc16", aholi:"272 000", maydoni:"36 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.200, 41.355], [69.218, 41.345], [69.235, 41.350],
          [69.255, 41.370], [69.250, 41.390], [69.220, 41.395],
          [69.195, 41.380], [69.190, 41.365], [69.200, 41.355],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Almazar", nomi_uz:"Almazar tumani", color:"#a78bfa", aholi:"248 000", maydoni:"32 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.235, 41.350], [69.255, 41.355], [69.270, 41.360],
          [69.275, 41.380], [69.260, 41.395], [69.245, 41.400],
          [69.220, 41.395], [69.255, 41.370], [69.235, 41.350],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Shayxontohur", nomi_uz:"Shayxontohur tumani", color:"#38bdf8", aholi:"188 000", maydoni:"18 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.240, 41.318], [69.260, 41.300], [69.285, 41.305],
          [69.290, 41.320], [69.280, 41.335], [69.265, 41.335],
          [69.255, 41.328], [69.240, 41.318],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Yakkasaroy", nomi_uz:"Yakkasaroy tumani", color:"#fb7185", aholi:"165 000", maydoni:"12 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.255, 41.280], [69.285, 41.280], [69.300, 41.265],
          [69.310, 41.275], [69.310, 41.295], [69.285, 41.305],
          [69.260, 41.300], [69.250, 41.285], [69.255, 41.280],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { nomi:"Mirobod", nomi_uz:"Mirobod tumani", color:"#34d399", aholi:"192 000", maydoni:"16 km²" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.285, 41.280], [69.330, 41.275], [69.330, 41.310],
          [69.310, 41.295], [69.310, 41.275], [69.285, 41.305],
          [69.285, 41.280],
        ]],
      },
    },
  ],
};
