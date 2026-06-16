"use client";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentMomolar from "@/components/dashboard/RecentMomolar";
import Link from "next/link";

const PARTICLES = [
  { x:10, y:20, size:2,   dur:"3.2s", del:"0s"   },
  { x:25, y:60, size:1.5, dur:"4.1s", del:"0.8s" },
  { x:40, y:15, size:3,   dur:"3.7s", del:"0.3s" },
  { x:55, y:70, size:1.5, dur:"5.0s", del:"1.2s" },
  { x:68, y:35, size:2,   dur:"3.5s", del:"0.6s" },
  { x:80, y:80, size:1,   dur:"4.5s", del:"0.1s" },
  { x:90, y:50, size:2.5, dur:"3.9s", del:"1.5s" },
];

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl p-7 anim-fade-up"
        style={{ background:"linear-gradient(135deg,#07142a 0%,#0d1f40 45%,#0a1628 100%)", border:"1px solid rgba(59,130,246,0.18)" }}>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(rgba(59,130,246,0.07) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />

        {/* Glowing orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none rounded-full"
          style={{ background:"radial-gradient(circle, rgba(59,130,246,0.12), transparent 65%)" }} />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 pointer-events-none rounded-full"
          style={{ background:"radial-gradient(circle, rgba(16,185,129,0.07), transparent 65%)" }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none anim-twinkle"
            style={{
              left:`${p.x}%`, top:`${p.y}%`,
              width:p.size, height:p.size,
              background:"rgba(96,165,250,0.6)",
              boxShadow:`0 0 ${p.size*3}px rgba(59,130,246,0.8)`,
              animationDuration: p.dur,
              animationDelay: p.del,
            }} />
        ))}

        {/* Spinning ring */}
        <div className="absolute top-4 right-32 w-24 h-24 pointer-events-none rounded-full anim-spin-slow"
          style={{ border:"1px solid rgba(59,130,246,0.08)", borderTopColor:"rgba(59,130,246,0.25)" }} />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
              style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full anim-pulse-glow" style={{ background:"#10b981", boxShadow:"0 0 6px #10b981" }} />
              <span className="text-xs font-bold tracking-wide" style={{ color:"rgba(96,165,250,0.8)" }}>Yer egasi paneli</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.97)" }}>
              Yer uchastkangiz holati
            </h1>
            <p className="text-sm mt-1.5" style={{ color:"rgba(120,150,200,0.55)" }}>
              Barcha momolar va ularning real vaqt holati
            </p>
          </div>
          <Link href="/user/momo-yuborish"
            className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all anim-scale-in anim-delay-3"
            style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
            onMouseEnter={(e:any) => { e.currentTarget.style.background="rgba(59,130,246,0.28)"; e.currentTarget.style.boxShadow="0 0 20px rgba(59,130,246,0.2)"; }}
            onMouseLeave={(e:any) => { e.currentTarget.style.background="rgba(59,130,246,0.15)"; e.currentTarget.style.boxShadow="none"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Momo yuborish
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Jami momolar" value={12} icon="⚠️" color="#3b82f6" change="Bu oy +3"   changeType="up"     delay={0} />
        <StatsCard title="Bajarildi"    value={8}  icon="✅" color="#10b981" change="67% rate"   changeType="neutral" delay={1} />
        <StatsCard title="Kutilmoqda"   value={4}  icon="⏳" color="#f59e0b" change="2 muddatli" changeType="down"    delay={2} />
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"rgba(100,130,200,0.4)" }}>Tez amallar</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href:"/user/momo-yuborish",    icon:"📤", label:"Momo yuborish",  sub:"Yangi muammo",  color:"#3b82f6", delay:"0s"    },
            { href:"/user/mening-momolarim", icon:"📋", label:"Momolarim",       sub:"12 ta momo",    color:"#10b981", delay:"0.06s" },
            { href:"/user/hisobotlar",        icon:"📊", label:"Hisobotlar",      sub:"AI tahlil",     color:"#8b5cf6", delay:"0.12s" },
            { href:"/xarita",                icon:"🗺️", label:"Xarita",          sub:"Joylashuv",     color:"#06b6d4", delay:"0.18s" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="group rounded-2xl p-4 transition-all duration-200 anim-fade-up relative overflow-hidden"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", animationDelay:item.delay }}
              onMouseEnter={(e:any) => {
                e.currentTarget.style.background=`${item.color}0e`;
                e.currentTarget.style.borderColor=`${item.color}30`;
                e.currentTarget.style.transform="translateY(-4px)";
                e.currentTarget.style.boxShadow=`0 12px 30px ${item.color}12`;
              }}
              onMouseLeave={(e:any) => {
                e.currentTarget.style.background="rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
              }}>
              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background:`linear-gradient(135deg, ${item.color}05, transparent 60%)` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 transition-all duration-200 group-hover:scale-110"
                style={{ background:`${item.color}15`, border:`1px solid ${item.color}25` }}>
                {item.icon}
              </div>
              <p className="text-sm font-semibold relative z-10" style={{ color:"rgba(200,220,255,0.88)" }}>{item.label}</p>
              <p className="text-xs mt-0.5 relative z-10" style={{ color:"rgba(100,130,200,0.5)" }}>{item.sub}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
                style={{ color:item.color }}>Ko'rish <span>→</span></div>
            </Link>
          ))}
        </div>
      </div>

      <RecentMomolar momolar={[]} />
    </div>
  );
}
