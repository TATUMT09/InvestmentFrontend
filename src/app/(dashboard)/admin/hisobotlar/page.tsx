import HisobotCard from "@/components/hisobot/HisobotCard";
import AiTahlilBlock from "@/components/hisobot/AiTahlilBlock";

const TASHKILOT_STATS: { nomi:string; tur:string; icon:string; color:string; jami:number; bajarildi:number; foiz:number }[] = [];

export default function AdminHisobotlarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Hisobotlar</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Tizim bo'yicha umumiy statistika va tahlil</p>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HisobotCard tur="kunlik"   jami={0} bajarildi={0} bajarilmadi={0} period="Bugun" />
        <HisobotCard tur="haftalik" jami={0} bajarildi={0} bajarilmadi={0} period="Bu hafta" />
        <HisobotCard tur="oylik"    jami={0} bajarildi={0} bajarilmadi={0} period="Bu oy" />
      </div>

      {/* Per-org performance */}
      <div>
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color:"rgba(100,130,200,0.6)" }}>
          Tashkilotlar samaradorligi
        </h2>
        <div className="space-y-2.5">
          {TASHKILOT_STATS.map(t => (
            <div key={t.nomi} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background:`${t.color}15`, border:`1px solid ${t.color}25` }}>
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.88)" }}>{t.nomi}</p>
                  <p className="text-sm font-bold" style={{ color: t.foiz>=80 ? "#34d399" : t.foiz>=65 ? "#fbbf24" : "#fb7185" }}>
                    {t.foiz}%
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width:`${t.foiz}%`, background: t.foiz>=80 ? "#10b981" : t.foiz>=65 ? "#f59e0b" : "#f43f5e" }} />
                </div>
                <div className="flex gap-4 mt-1.5">
                  <span className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>Jami: <b style={{ color:"rgba(150,180,230,0.7)" }}>{t.jami}</b></span>
                  <span className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>Bajarildi: <b style={{ color:"#34d399" }}>{t.bajarildi}</b></span>
                  <span className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>Qoldi: <b style={{ color:"#fb7185" }}>{t.jami-t.bajarildi}</b></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AiTahlilBlock />
    </div>
  );
}
