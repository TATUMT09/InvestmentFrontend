"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ReactNode; exact?: boolean; badge?: string };

const navItems: Record<string, NavItem[]> = {
  superadmin: [
    { href: "/superadmin",              label: "Dashboard",      icon: <IconDash />,    exact: true },
    { href: "/superadmin/admins",       label: "Adminlar",       icon: <IconUsers /> },
    { href: "/superadmin/tashkilotlar", label: "Tashkilotlar",   icon: <IconBuilding /> },
    { href: "/superadmin/userlar",      label: "Userlar",        icon: <IconPeople /> },
    { href: "/superadmin/hisobotlar",   label: "Hisobotlar",     icon: <IconChart /> },
    { href: "/xarita",                  label: "Xarita",         icon: <IconMap /> },
  ],
  admin: [
    { href: "/admin",                   label: "Dashboard",      icon: <IconDash />,    exact: true },
    { href: "/admin/userlar",           label: "Userlar",        icon: <IconPeople /> },
    { href: "/admin/tashkilotlar",      label: "Tashkilotlar",   icon: <IconBuilding /> },
    { href: "/admin/momolar",           label: "Momolar",        icon: <IconAlert />,   badge: "23" },
    { href: "/admin/vaqt-belgilash",    label: "Vaqt belgilash", icon: <IconClock /> },
    { href: "/admin/hisobotlar",        label: "Hisobotlar",     icon: <IconChart /> },
    { href: "/xarita",                  label: "Xarita",         icon: <IconMap /> },
  ],
  HOKIM: [
    { href: "/hokim",                        label: "Dashboard",       icon: <IconDash />,      exact: true },
    { href: "/investitsiya/obyektlar",       label: "Obyektlar",       icon: <IconBuilding /> },
    { href: "/investitsiya/muammolar",       label: "Muammolar",       icon: <IconAlert /> },
    { href: "/investitsiya/yangiliklar",     label: "Yangiliklar",     icon: <IconBell /> },
    { href: "/investitsiya/hujjatlar",       label: "Hujjatlar",       icon: <IconFolder /> },
    { href: "/superadmin/userlar",           label: "Foydalanuvchilar",icon: <IconPeople /> },
    { href: "/superadmin/hisobotlar",        label: "Hisobotlar",      icon: <IconChart /> },
  ],
  INVESTITSIYA: [
    { href: "/admin",                              label: "Dashboard",        icon: <IconDash />,      exact: true },
    { href: "/investitsiya/obyektlar",             label: "Obyektlar",        icon: <IconBuilding /> },
    { href: "/investitsiya/muammolar",             label: "Muammolar",        icon: <IconAlert /> },
    { href: "/investitsiya/yangiliklar",           label: "Yangiliklar",      icon: <IconBell /> },
    { href: "/investitsiya/hujjatlar",             label: "Hujjatlar",        icon: <IconFolder /> },
    { href: "/investitsiya/foydalanuvchilar",      label: "Foydalanuvchilar", icon: <IconPeople /> },
  ],
  QURILISH: [
    { href: "/qurilish",                     label: "Dashboard",    icon: <IconDash />,     exact: true },
    { href: "/qurilish/obyektlar",           label: "Obyektlar",    icon: <IconBuilding /> },
    { href: "/investitsiya/muammolar",       label: "Muammolar",    icon: <IconAlert /> },
    { href: "/investitsiya/hujjatlar",       label: "Hujjatlar",    icon: <IconFolder /> },
    { href: "/admin/hisobotlar",             label: "Hisobotlar",   icon: <IconChart /> },
    { href: "/qurilish/foydalanuvchilar",    label: "Foydalanuvchilar", icon: <IconPeople /> },
  ],
  TADBIRKOR: [
    { href: "/user",                    label: "Bosh sahifa",      icon: <IconDash />,    exact: true },
    { href: "/user/momo-yuborish",      label: "Momo yuborish",    icon: <IconSend /> },
    { href: "/user/mening-momolarim",   label: "Momolarim",        icon: <IconList /> },
    { href: "/user/malumot-yuborish",   label: "Ma'lumot yuborish",icon: <IconSend /> },
    { href: "/user/malumotlarim",       label: "Ma'lumotlarim",    icon: <IconList /> },
    { href: "/user/hisobotlar",         label: "Hisobotlar",       icon: <IconChart /> },
    { href: "/xarita",                  label: "Xarita",           icon: <IconMap /> },
  ],
  tashkilot: [
    { href: "/tashkilot",              label: "Dashboard",       icon: <IconDash />,    exact: true },
    { href: "/tashkilot/momolar",      label: "Momolar",         icon: <IconAlert />,   badge: "5" },
    { href: "/tashkilot/statistika",   label: "Statistika",      icon: <IconChart /> },
  ],
  TASHKILOT: [
    { href: "/tashkilot",              label: "Dashboard",       icon: <IconDash />,    exact: true },
    { href: "/tashkilot/momolar",      label: "Momolar",         icon: <IconAlert />,   badge: "5" },
    { href: "/tashkilot/statistika",   label: "Statistika",      icon: <IconChart /> },
  ],
  tadbirkor: [
    { href: "/user",                    label: "Bosh sahifa",      icon: <IconDash />,    exact: true },
    { href: "/user/momo-yuborish",      label: "Momo yuborish",    icon: <IconSend /> },
    { href: "/user/mening-momolarim",   label: "Momolarim",        icon: <IconList /> },
    { href: "/user/malumot-yuborish",   label: "Ma'lumot yuborish",icon: <IconSend /> },
    { href: "/user/malumotlarim",       label: "Ma'lumotlarim",    icon: <IconList /> },
    { href: "/user/hisobotlar",         label: "Hisobotlar",       icon: <IconChart /> },
    { href: "/xarita",                  label: "Xarita",           icon: <IconMap /> },
  ],
  user: [
    { href: "/user",                    label: "Bosh sahifa",      icon: <IconDash />,    exact: true },
    { href: "/user/momo-yuborish",      label: "Momo yuborish",    icon: <IconSend /> },
    { href: "/user/mening-momolarim",   label: "Momolarim",        icon: <IconList /> },
    { href: "/user/malumot-yuborish",   label: "Ma'lumot yuborish",icon: <IconSend /> },
    { href: "/user/malumotlarim",       label: "Ma'lumotlarim",    icon: <IconList /> },
    { href: "/user/hisobotlar",         label: "Hisobotlar",       icon: <IconChart /> },
    { href: "/xarita",                  label: "Xarita",           icon: <IconMap /> },
  ],
};

const roleConfig: Record<string, { label: string; color: string; dot: string }> = {
  superadmin:   { label: "Superadmin",    color: "#f43f5e", dot: "#f43f5e" },
  SUPERADMIN:   { label: "Superadmin",    color: "#f43f5e", dot: "#f43f5e" },
  admin:        { label: "Admin",         color: "#3b82f6", dot: "#3b82f6" },
  ADMIN:        { label: "Admin",         color: "#3b82f6", dot: "#3b82f6" },
  HOKIM:        { label: "Hokim",         color: "#f43f5e", dot: "#f43f5e" },
  hokim:        { label: "Hokim",         color: "#f43f5e", dot: "#f43f5e" },
  INVESTITSIYA: { label: "Investitsiya",  color: "#3b82f6", dot: "#3b82f6" },
  investitsiya: { label: "Investitsiya",  color: "#3b82f6", dot: "#3b82f6" },
  QURILISH:     { label: "Qurilish",      color: "#8b5cf6", dot: "#8b5cf6" },
  qurilish:     { label: "Qurilish",      color: "#8b5cf6", dot: "#8b5cf6" },
  tashkilot:    { label: "Tashkilot",     color: "#10b981", dot: "#10b981" },
  TASHKILOT:    { label: "Tashkilot",     color: "#10b981", dot: "#10b981" },
  TADBIRKOR:    { label: "Tadbirkor",     color: "#f59e0b", dot: "#f59e0b" },
  tadbirkor:    { label: "Tadbirkor",     color: "#f59e0b", dot: "#f59e0b" },
  user:         { label: "Foydalanuvchi", color: "#f59e0b", dot: "#f59e0b" },
  USER:         { label: "Foydalanuvchi", color: "#f59e0b", dot: "#f59e0b" },
};

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, lightMode, toggleTheme } = useUiStore();
  const pathname = usePathname();
  if (!user) return null;

  const items = navItems[user.role] || [];
  const rc = roleConfig[user.role];
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  /* ── Theme-aware colors ── */
  const t = lightMode ? {
    sidebar:    "#ffffff",
    border:     "#e2e8f0",
    logo:       "#0f172a",
    logoSub:    "#64748b",
    badge:      "#f1f5f9",
    badgeBorder:"#e2e8f0",
    badgeText:  "#374151",
    sectionLbl: "#94a3b8",
    navText:    "#374151",
    navTextAct: "#1d4ed8",
    navIconAct: "#2563eb",
    navIcon:    "#64748b",
    navBgAct:   "rgba(37,99,235,0.08)",
    navBorderAct:"rgba(37,99,235,0.2)",
    navHover:   "rgba(0,0,0,0.04)",
    navBarAct:  "#2563eb",
    userBg:     "#f8fafc",
    userBgHov:  "#f1f5f9",
    userName:   "#0f172a",
    userEmail:  "#64748b",
    toggleBg:   "#fef9c3",
    toggleBdr:  "#fde047",
    toggleTxt:  "#92400e",
  } : {
    sidebar:    "#0d1528",
    border:     "rgba(255,255,255,0.06)",
    logo:       "rgba(220,235,255,0.9)",
    logoSub:    "rgba(120,150,255,0.45)",
    badge:      "rgba(255,255,255,0.04)",
    badgeBorder:"rgba(255,255,255,0.07)",
    badgeText:  "rgba(180,200,255,0.7)",
    sectionLbl: "rgba(100,130,255,0.35)",
    navText:    "rgba(150,175,220,0.65)",
    navTextAct: "rgba(180,210,255,0.95)",
    navIconAct: "#60a5fa",
    navIcon:    "rgba(120,150,200,0.6)",
    navBgAct:   "rgba(59,130,246,0.12)",
    navBorderAct:"rgba(59,130,246,0.2)",
    navHover:   "rgba(255,255,255,0.05)",
    navBarAct:  "#3b82f6",
    userBg:     "rgba(255,255,255,0.03)",
    userBgHov:  "rgba(255,255,255,0.07)",
    userName:   "rgba(210,225,255,0.9)",
    userEmail:  "rgba(100,130,200,0.5)",
    toggleBg:   "rgba(255,255,255,0.04)",
    toggleBdr:  "rgba(255,255,255,0.07)",
    toggleTxt:  "rgba(150,175,220,0.65)",
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out",
      sidebarOpen ? "w-[268px]" : "w-[72px]",
    )} style={{ background: t.sidebar, borderRight: `1px solid ${t.border}`, transition:"all 0.3s ease" }}>

      {/* Logo */}
      <div className={cn("flex items-center h-[60px] px-4 shrink-0", !sidebarOpen && "justify-center")}
        style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.25)" }}>
          🌍
        </div>
        {sidebarOpen && (
          <div className="ml-3 overflow-hidden">
            <p className="font-bold text-sm leading-none" style={{ color: t.logo }}>Investitsiya</p>
            <p className="text-[11px] mt-0.5" style={{ color: t.logoSub }}>Boshqaruv tizimi</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {sidebarOpen && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: t.badge, border: `1px solid ${t.badgeBorder}` }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: rc.dot, boxShadow: `0 0 6px ${rc.dot}` }} />
            <span className="text-[11px] font-semibold" style={{ color: t.badgeText }}>
              {rc.label} paneli
            </span>
          </div>
        </div>
      )}

      {/* Section label */}
      {sidebarOpen && (
        <p className="px-5 pt-4 pb-1.5 text-[10px] font-bold tracking-widest uppercase"
          style={{ color: t.sectionLbl }}>
          Menyu
        </p>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 py-1 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              title={!sidebarOpen ? item.label : undefined}
              className={cn(
                "relative flex items-center rounded-xl transition-all duration-150",
                sidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center py-2.5 px-0",
              )}
              style={{
                background: active ? t.navBgAct : "transparent",
                border: active ? `1px solid ${t.navBorderAct}` : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.navHover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: t.navBarAct }} />
              )}
              <span style={{ color: active ? t.navIconAct : t.navIcon }}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1"
                    style={{ color: active ? t.navTextAct : t.navText }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background:"rgba(59,130,246,0.2)", color:"#93c5fd" }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className={cn("shrink-0 px-2 pb-1", !sidebarOpen && "flex justify-center px-2")}>
        <button onClick={toggleTheme}
          title={lightMode ? "Qorang'i rejim" : "Yorug' rejim"}
          className={cn(
            "flex items-center rounded-xl transition-all duration-200 w-full",
            sidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center py-2.5 px-0",
          )}
          style={{ background: t.toggleBg, border: `1px solid ${t.toggleBdr}` }}>
          <span style={{ color: lightMode ? "#b45309" : "rgba(120,150,200,0.7)" }}>
            {lightMode ? <IconSun /> : <IconMoon />}
          </span>
          {sidebarOpen && (
            <span className="text-sm font-medium flex-1 text-left" style={{ color: t.toggleTxt }}>
              {lightMode ? "Yorug' rejim" : "Qorang'i rejim"}
            </span>
          )}
          {sidebarOpen && (
            <span className="w-8 h-4 rounded-full relative flex-shrink-0 transition-all duration-300"
              style={{ background: lightMode ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.15)" }}>
              <span className="absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: lightMode ? "#fbbf24" : "rgba(150,175,220,0.7)",
                  left: lightMode ? "calc(100% - 14px)" : "2px",
                  boxShadow: lightMode ? "0 0 6px #fbbf2490" : "none",
                }} />
            </span>
          )}
        </button>
      </div>

      {/* User */}
      <div className={cn("shrink-0 p-3", !sidebarOpen && "flex justify-center")}
        style={{ borderTop: `1px solid ${t.border}` }}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all"
            style={{ background: t.userBg }}
            onMouseEnter={e => (e.currentTarget.style.background = t.userBgHov)}
            onMouseLeave={e => (e.currentTarget.style.background = t.userBg)}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background:`${rc.dot}25`, border:`1px solid ${rc.dot}40`, color: rc.dot }}>
              {user.ism?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none" style={{ color: t.userName }}>{user.ism}</p>
              <p className="text-[11px] truncate mt-0.5" style={{ color: t.userEmail }}>{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background:`${rc.dot}25`, border:`1px solid ${rc.dot}40`, color: rc.dot }}>
            {user.ism?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
    </aside>
  );
}

function IconDash()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconUsers()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IconPeople()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IconBuilding() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> }
function IconAlert()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function IconChart()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconMap()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> }
function IconClock()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconSend()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> }
function IconList()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
function IconSun()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> }
function IconMoon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> }

function IconFolder()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> }
function IconBell()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
