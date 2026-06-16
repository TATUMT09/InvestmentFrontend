import HisobotCard from "@/components/hisobot/HisobotCard";

const XODIMLAR: { ism:string; lavozim:string; bajarilgan:number; reyting:number }[] = [];

export default function TashkilotStatistikaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Statistika</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Tashkilot faoliyati ko'rsatkichlari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HisobotCard tur="kunlik"   jami={0} bajarildi={0} bajarilmadi={0} period="Bugun" />
        <HisobotCard tur="haftalik" jami={0} bajarildi={0} bajarilmadi={0} period="Bu hafta" />
        <HisobotCard tur="oylik"    jami={0} bajarildi={0} bajarilmadi={0} period="Bu oy" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"O'rtacha hal qilish", val:"—",   color:"#60a5fa" },
          { label:"O'z vaqtida",         val:"—",   color:"#34d399" },
          { label:"Mijoz bahosi",        val:"—",   color:"#fbbf24" },
          { label:"Aktiv xodimlar",      val:"—",   color:"#a78bfa" },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-2xl font-bold" style={{ color:k.color }}>{k.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.55)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Xodimlar */}
      <div>
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color:"rgba(100,130,200,0.6)" }}>
          Xodimlar samaradorligi
        </h2>
        <div className="space-y-2">
          {XODIMLAR.map((x, i) => (
            <div key={x.ism} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: i===0 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", color: i===0 ? "#fbbf24" : "rgba(150,180,230,0.6)" }}>
                {i+1}
              </span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background:"rgba(59,130,246,0.15)", color:"#60a5fa" }}>
                {x.ism[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{x.ism}</p>
                <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{x.lavozim}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color:"#34d399" }}>{x.bajarilgan} ta</p>
                <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>bajarildi</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color:"#fbbf24" }}>★ {x.reyting}</p>
                <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>reyting</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
