import { MomoStatus } from "@/types/momo.types";
import { MOMO_STATUS_LABELS } from "@/lib/constants";

const STEPS: MomoStatus[] = ["yuborildi","korib_chiqilmoqda","bajarilmoqda","bajarildi"];
const stepIcons: Record<MomoStatus,string> = { yuborildi:"📤", korib_chiqilmoqda:"🔍", bajarilmoqda:"🔧", bajarildi:"✅" };

export default function MomoStatusStepper({ currentStatus }: { currentStatus:MomoStatus }) {
  const idx = STEPS.indexOf(currentStatus);
  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done = i < idx, active = i === idx;
        return (
          <div key={step} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: done ? "rgba(16,185,129,0.15)" : active ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                  border: done ? "1.5px solid #10b981" : active ? "1.5px solid #3b82f6" : "1.5px solid rgba(255,255,255,0.1)",
                  color: done ? "#34d399" : active ? "#60a5fa" : "rgba(100,130,200,0.4)",
                  boxShadow: active ? "0 0 20px rgba(59,130,246,0.25)" : "none",
                }}>
                {done ? "✓" : stepIcons[step]}
              </div>
              <p className="text-xs mt-2 text-center font-medium leading-tight max-w-[70px]"
                style={{ color: active ? "#60a5fa" : done ? "#34d399" : "rgba(100,130,200,0.4)" }}>
                {MOMO_STATUS_LABELS[step]}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 mt-5 mx-1 rounded-full"
                style={{ background: done ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
