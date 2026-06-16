"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { User, Role } from "@/types/auth.types";

interface LoginResponse {
  token: string;
  id: number;
  fullName: string;
  username: string;
  role: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const { setAuth, redirectByRole } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ❌ MOCK_USERS O'CHIRILDI - DEMO YO'Q

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { username, password });
      const user: User = {
        id: String(data.id),
        ism: data.fullName,
        email: data.username,
        role: data.role as Role,
        createdAt: new Date(),
      };
      setAuth(user, data.token);
      redirectByRole();
      return;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 401) {
        setError("Foydalanuvchi nomi yoki parol noto'g'ri");
      } else {
        // ❌ SERVER YO'QSA HAM MOCK YO'Q - FAQAT XATOLIK
        setError("Server bilan bog'lanib bo'lmadi. Iltimos, keyinroq urinib ko'ring.");
      }
    }
    setLoading(false);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  /* ── color tokens ── */
  const navy  = "#0d1f3c";
  const navyL = "#162d52";
  const gold  = "#c9a84c";
  const goldL = "#e2c06a";
  const cream = "#faf7f0";
  const creamD= "#f0ead8";
  const creamDD="#e8e0cc";

  return (
    <div className="min-h-screen flex" style={{ background: cream }}>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col overflow-hidden"
        style={{ background: navy }}>

        {/* subtle texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* top-right glow */}
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${gold}18, transparent 65%)` }} />

        {/* bottom-left glow */}
        <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          style={{ background: `radial-gradient(circle at bottom left, ${navyL}, transparent 70%)` }} />

        {/* gold top line */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${gold}, ${goldL}, ${gold}, transparent)` }} />

        {/* vertical gold stripe */}
        <div className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(180deg, transparent, ${gold}40, ${gold}60, ${gold}40, transparent)` }} />

        {/* ── HEADER ── */}
        <div className="relative z-10 px-10 pt-10 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
              style={{ background: `linear-gradient(135deg, ${gold}30, ${gold}15)`, border: `1.5px solid ${gold}60` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={gold} strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke={gold} strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke={gold} strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide" style={{ color: cream }}>
                O&apos;zbekiston Respublikasi
              </p>
              <p className="text-[11px] tracking-widest font-medium mt-0.5" style={{ color: `${gold}cc` }}>
                INVESTITSIYA TIZIMI
              </p>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${gold}80, transparent)` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
          </div>

          <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: `${gold}99` }}>
            Davlat boshqaruv portali
          </p>

          <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-5"
            style={{ color: cream, letterSpacing: "-0.02em" }}>
            Investitsiya va<br />
            Qurilish Loyihalari<br />
            <span style={{ color: gold }}>Monitoring Tizimi</span>
          </h1>

          <p className="text-sm leading-relaxed mb-10"
            style={{ color: `${cream}70`, maxWidth: 380 }}>
            Loyihalar holati, muammolar va moliyaviy ko&apos;rsatkichlarni
            real vaqtda kuzating va boshqaring.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "240+", label: "Faol loyiha" },
              { val: "98%",  label: "Hal qilingan" },
              { val: "12",   label: "Viloyat" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl px-4 py-3.5"
                style={{ background: `${cream}06`, border: `1px solid ${cream}10` }}>
                <p className="text-xl font-bold mb-0.5" style={{ color: gold }}>{s.val}</p>
                <p className="text-[11px]" style={{ color: `${cream}50` }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-10">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${gold}80, transparent)` }} />
          </div>
        </div>

        <div className="relative z-10 px-10 pb-8">
          <p className="text-[11px]" style={{ color: `${cream}30` }}>
            © 2026 O&apos;zbekiston Respublikasi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative"
        style={{ background: cream }}>

        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: `radial-gradient(circle, ${creamDD} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

        <div className="lg:hidden absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${gold}, ${goldL}, ${gold}, transparent)` }} />

        <div
          className={`relative w-full max-w-[400px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: navy, border: `1.5px solid ${gold}60` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm font-bold" style={{ color: navy }}>Investitsiya Tizimi</p>
          </div>

          <div className="rounded-3xl overflow-hidden"
            style={{
              background: "#ffffff",
              border: `1px solid ${creamDD}`,
              boxShadow: `0 4px 6px ${navy}08, 0 20px 60px ${navy}12, 0 0 0 1px ${creamDD}`,
            }}>

            <div className="h-1" style={{ background: `linear-gradient(90deg, ${navy}, ${gold}, ${navy})` }} />

            <div className="px-8 pt-8 pb-9">

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: `${gold}20` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: `${gold}cc` }}>
                    Tizimga kirish
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight"
                  style={{ color: navy, letterSpacing: "-0.02em" }}>
                  Xush kelibsiz
                </h2>
                <p className="text-sm mt-1.5" style={{ color: "#6b7a99" }}>
                  Davlat boshqaruv tizimiga kirish uchun<br />
                  ma&apos;lumotlaringizni kiriting
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-2 uppercase"
                    style={{ color: "#8896b0" }}>
                    Foydalanuvchi nomi
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: username ? navy : "#b0bdd4" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      placeholder="username"
                      autoComplete="username"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl outline-none transition-all"
                      style={{
                        background: creamD,
                        border: `1.5px solid ${username ? navy + "60" : creamDD}`,
                        color: navy,
                      }}
                      onFocus={e => {
                        e.target.style.background = "#fff";
                        e.target.style.borderColor = navy;
                        e.target.style.boxShadow = `0 0 0 3px ${navy}10`;
                      }}
                      onBlur={e => {
                        e.target.style.background = creamD;
                        e.target.style.borderColor = username ? navy + "60" : creamDD;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest mb-2 uppercase"
                    style={{ color: "#8896b0" }}>
                    Parol
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: password ? navy : "#b0bdd4" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3 text-sm rounded-xl outline-none transition-all"
                      style={{
                        background: creamD,
                        border: `1.5px solid ${password ? navy + "60" : creamDD}`,
                        color: navy,
                      }}
                      onFocus={e => {
                        e.target.style.background = "#fff";
                        e.target.style.borderColor = navy;
                        e.target.style.boxShadow = `0 0 0 3px ${navy}10`;
                      }}
                      onBlur={e => {
                        e.target.style.background = creamD;
                        e.target.style.borderColor = password ? navy + "60" : creamDD;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ color: "#b0bdd4" }}
                      onMouseEnter={e => { e.currentTarget.style.background = creamDD; e.currentTarget.style.color = navy; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b0bdd4"; }}>
                      {showPass
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`flex items-start gap-2.5 text-xs px-4 py-3 rounded-xl ${shake ? "anim-shake" : ""}`}
                    style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", color: "#be123c" }}>
                    <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden"
                    style={{
                      background: loading
                        ? "#8896b0"
                        : `linear-gradient(135deg, ${navy} 0%, ${navyL} 100%)`,
                      color: cream,
                      border: `1.5px solid ${loading ? "transparent" : navy}`,
                      boxShadow: loading ? "none" : `0 4px 20px ${navy}40, inset 0 1px 0 rgba(255,255,255,0.08)`,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = `0 8px 28px ${navy}55, inset 0 1px 0 rgba(255,255,255,0.1)`;
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = loading ? "none" : `0 4px 20px ${navy}40, inset 0 1px 0 rgba(255,255,255,0.08)`;
                    }}>
                    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent 0%, ${gold}15 50%, transparent 100%)` }} />
                    {loading
                      ? <span className="flex items-center justify-center gap-2.5">
                          <span className="w-4 h-4 border-2 rounded-full animate-spin"
                            style={{ borderColor: `${cream}30`, borderTopColor: cream }} />
                          Tekshirilmoqda...
                        </span>
                      : <span className="flex items-center justify-center gap-2 relative">
                          Tizimga kirish
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                    }
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-3 mt-7">
                <div className="flex-1 h-px" style={{ background: creamDD }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: `${gold}80` }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: `${gold}80` }} />
                </div>
                <div className="flex-1 h-px" style={{ background: creamDD }} />
              </div>

              <div className="mt-6 flex items-start gap-3 px-4 py-3.5 rounded-xl"
                style={{ background: creamD, border: `1px solid ${creamDD}` }}>
                <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p className="text-[11px] leading-relaxed" style={{ color: "#8896b0" }}>
                  Tizim{" "}
                  <span style={{ color: navy, fontWeight: 600 }}>256-bit SSL shifrlash</span>{" "}
                  bilan himoyalangan. Faqat vakolatli foydalanuvchilar kirishi mumkin.
                </p>
              </div>

              {/* ❌ OFFLINE HINT O'CHIRILDI - DEMO YO'Q */}

            </div>
          </div>

          <p className="text-center text-[11px] mt-6" style={{ color: "#b0bdd4" }}>
            O&apos;zbekiston Respublikasi · Raqamli texnologiyalar vazirligi
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-6px)}
          30%{transform:translateX(6px)}
          45%{transform:translateX(-3px)}
          60%{transform:translateX(3px)}
          75%{transform:translateX(-1px)}
        }
        .anim-shake { animation: shake 0.42s cubic-bezier(.36,.07,.19,.97) both; }
        input::placeholder { color: #b0bdd4; }
      `}</style>
    </div>
  );
}
