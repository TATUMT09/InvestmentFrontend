import HisobotCard from "@/components/hisobot/HisobotCard";
import AiTahlilBlock from "@/components/hisobot/AiTahlilBlock";

const VILOYATLAR: { nom:string; jami:number; bajarildi:number; foiz:number; color:string }[] = [];

const TUR_STATS: { tur:string; icon:string; color:string; jami:number; bajarildi:number; foiz:number }[] = [];

export default function SuperadminHisobotlarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Tizim hisobotlari</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Barcha adminlar va tashkilotlar bo'yicha umumiy statistika</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HisobotCard tur="kunlik"   jami={0} bajarildi={0} bajarilmadi={0} period="Bugun" />
        <HisobotCard tur="haftalik" jami={0} bajarildi={0} bajarilmadi={0} period="Bu hafta" />
        <HisobotCard tur="oylik"    jami={0} bajarildi={0} bajarilmadi={0} period="Bu oy" />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami adminlar",     val:"0",   color:"#a78bfa" },
          { label:"Jami tashkilotlar", val:"0",   color:"#60a5fa" },
          { label:"Jami userlar",      val:"0",   color:"#34d399" },
          { label:"O'rt. hal qilish",  val:"—",   color:"#fbbf24" },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-2xl font-bold" style={{ color:k.color }}>{k.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.55)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By region */}
        <div>
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color:"rgba(100,130,200,0.6)" }}>
            Viloyatlar bo'yicha
          </h2>
          <div className="space-y-2.5">
            {VILOYATLAR.map(v => (
              <div key={v.nom} className="p-4 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background:v.color, boxShadow:`0 0 6px ${v.color}60` }} />
                    <span className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.88)" }}>{v.nom}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: v.foiz>=80 ? "#34d399" : v.foiz>=70 ? "#fbbf24" : "#fb7185" }}>{v.foiz}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background:"rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width:`${v.foiz}%`, background: v.foiz>=80 ? "#10b981" : v.foiz>=70 ? "#f59e0b" : "#f43f5e" }} />
                </div>
                <div className="flex gap-4 text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>
                  <span>Jami: <b style={{ color:"rgba(150,180,230,0.7)" }}>{v.jami}</b></span>
                  <span>✓ <b style={{ color:"#34d399" }}>{v.bajarildi}</b></span>
                  <span>✗ <b style={{ color:"#fb7185" }}>{v.jami-v.bajarildi}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By type */}
        <div>
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color:"rgba(100,130,200,0.6)" }}>
            Momo turlari bo'yicha
          </h2>
          <div className="space-y-2.5">
            {TUR_STATS.map(t => (
              <div key={t.tur} className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background:`${t.color}15`, border:`1px solid ${t.color}25` }}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.88)" }}>{t.tur}</span>
                    <span className="text-xs font-bold" style={{ color: t.foiz>=80 ? "#34d399" : t.foiz>=70 ? "#fbbf24" : "#fb7185" }}>{t.foiz}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width:`${t.foiz}%`, background:t.color }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>{t.jami}</p>
                  <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>jami</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AiTahlilBlock />
    </div>
  );
}
