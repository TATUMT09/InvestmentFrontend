import StatsCard from "@/components/dashboard/StatsCard";
import RecentMomolar from "@/components/dashboard/RecentMomolar";
import Link from "next/link";

export default function TashkilotDashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 anim-fade-up"
        style={{ background:"linear-gradient(135deg,#051f15 0%,#0a2a1e 50%,#0d1528 100%)", border:"1px solid rgba(16,185,129,0.2)" }}>
        <div className="absolute inset-0" style={{ backgroundImage:"radial-gradient(rgba(16,185,129,0.05) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <div className="absolute -right-16 -bottom-16 w-56 h-56 pointer-events-none"
          style={{ background:"radial-gradient(circle, rgba(16,185,129,0.08), transparent 60%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full"
              style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)" }}>
              <span className="text-xs font-semibold" style={{ color:"rgba(52,211,153,0.8)" }}>⚡ Elektr tashkiloti</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Kelgan momolar</h1>
            <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Sizga yo'naltirilgan muammolarni hal qiling</p>
          </div>
          <Link href="/tashkilot/momolar" className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", color:"#34d399" }}>
            Barchasini ko'rish →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Yangi momolar"   value={5}  icon="🆕" color="#f59e0b" change="3 ta bugun"    changeType="up"     delay={0} />
        <StatsCard title="Jarayonda"       value={12} icon="🔧" color="#3b82f6" change="O'rt. 2.4 kun" changeType="neutral" delay={1} />
        <StatsCard title="Bu oy bajarildi" value={89} icon="✅" color="#10b981" change="+12 o'tganga"  changeType="up"     delay={2} />
      </div>

      {/* Status overview */}
      <div className="rounded-2xl p-5 anim-fade-up anim-delay-3"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p className="font-semibold text-sm mb-4" style={{ color:"rgba(210,225,255,0.9)" }}>Holat bo'yicha taqsimot</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Yangi keldi",   count:5,  color:"#94a3b8" },
            { label:"Ko'rilmoqda",   count:8,  color:"#f59e0b" },
            { label:"Bajarilmoqda",  count:12, color:"#3b82f6" },
            { label:"Bajarildi",     count:89, color:"#10b981" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background:`${s.color}08`, border:`1px solid ${s.color}20` }}>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.color, boxShadow:`0 0 6px ${s.color}` }} />
                <p className="text-xs font-semibold" style={{ color:s.color }}>{s.label}</p>
              </div>
              <p className="text-3xl font-bold" style={{ color:"rgba(210,225,255,0.9)" }}>{s.count}</p>
            </div>
          ))}
        </div>
      </div>
      <RecentMomolar momolar={[]} />
    </div>
  );
}
