"use client";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentMomolar from "@/components/dashboard/RecentMomolar";
import Link from "next/link";

export default function SuperadminDashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 anim-fade-up"
        style={{ background:"linear-gradient(135deg,#0f0a1e 0%,#1a0a2e 50%,#0d1528 100%)", border:"1px solid rgba(244,63,94,0.15)" }}>
        <div className="absolute inset-0" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
        <div className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none"
          style={{ background:"radial-gradient(circle, rgba(124,58,237,0.1), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
            style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#f43f5e", boxShadow:"0 0 6px #f43f5e" }} />
            <span className="text-xs font-bold" style={{ color:"rgba(252,165,165,0.8)" }}>SUPERADMIN — To'liq nazorat</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Tizim bosh paneli</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Barcha adminlar, tashkilotlar va foydalanuvchilarni boshqaring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Adminlar"     value={0} icon="👤" color="#3b82f6" delay={0} />
        <StatsCard title="Tashkilotlar" value={0} icon="🏢" color="#10b981" delay={1} />
        <StatsCard title="Userlar"      value={0} icon="👥" color="#8b5cf6" delay={2} />
        <StatsCard title="Jami momolar" value={0} icon="⚠️" color="#f59e0b" delay={3} />
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"rgba(100,130,200,0.4)" }}>Boshqaruv</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href:"/superadmin/admins",       icon:"👤", title:"Adminlar",       desc:"Admin qo'shish va boshqarish",      color:"#3b82f6" },
            { href:"/superadmin/tashkilotlar", icon:"🏢", title:"Tashkilotlar",   desc:"Momo yo'naltiriladigan tashkilotlar", color:"#10b981" },
            { href:"/superadmin/userlar",      icon:"👥", title:"Barcha userlar", desc:"Ro'yxatdagi foydalanuvchilar",      color:"#8b5cf6" },
            { href:"/superadmin/hisobotlar",   icon:"📊", title:"Tizim hisoboti", desc:"Statistika va AI tahlil",           color:"#f59e0b" },
            { href:"/xarita",                  icon:"🗺️", title:"Xarita",        desc:"Barcha momolar joylashuvi",         color:"#06b6d4" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="group rounded-2xl p-5 transition-all"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={(e:any) => { e.currentTarget.style.background=`${item.color}08`; e.currentTarget.style.borderColor=`${item.color}25`; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={(e:any) => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background:`${item.color}15`, border:`1px solid ${item.color}25` }}>
                {item.icon}
              </div>
              <p className="font-bold mb-1" style={{ color:"rgba(210,225,255,0.9)" }}>{item.title}</p>
              <p className="text-sm leading-relaxed" style={{ color:"rgba(100,130,200,0.55)" }}>{item.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color:item.color }}>Ko'rish →</div>
            </Link>
          ))}
        </div>
      </div>
      <RecentMomolar momolar={[]} />
    </div>
  );
}
