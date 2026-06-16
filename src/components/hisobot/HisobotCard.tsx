const cfg = {
  kunlik:   { label: "Kunlik",   icon: "📅", color: "#3b82f6" },
  haftalik: { label: "Haftalik", icon: "📆", color: "#8b5cf6" },
  oylik:    { label: "Oylik",    icon: "🗓️", color: "#10b981" },
};

export default function HisobotCard({ tur, jami, bajarildi, bajarilmadi, period }: {
  tur: "kunlik"|"haftalik"|"oylik"; jami:number; bajarildi:number; bajarilmadi:number; period:string;
}) {
  const foiz = jami > 0 ? Math.round((bajarildi / jami) * 100) : 0;
  const c = cfg[tur];
  return (
    <div className="rounded-2xl p-5 hover:border-opacity-20 transition-all"
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background:`${c.color}18`, border:`1px solid ${c.color}30` }}>{c.icon}</div>
          <div>
            <p className="font-bold text-sm" style={{ color:"rgba(210,225,255,0.9)" }}>{c.label}</p>
            <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{period}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color:c.color }}>{foiz}%</p>
          <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>bajarildi</p>
        </div>
      </div>
      <div className="relative h-1.5 rounded-full mb-4 overflow-hidden"
        style={{ background:"rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width:`${foiz}%`, background:c.color, boxShadow:`0 0 8px ${c.color}` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l:"Jami",      v:jami,       color:"rgba(150,175,220,0.8)" },
          { l:"Bajarildi", v:bajarildi,  color:"#34d399" },
          { l:"Qoldi",     v:bajarilmadi,color:"#f87171" },
        ].map(s => (
          <div key={s.l} className="rounded-xl p-3 text-center"
            style={{ background:"rgba(255,255,255,0.04)" }}>
            <p className="text-xl font-bold" style={{ color:s.color }}>{s.v}</p>
            <p className="text-[11px] mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
