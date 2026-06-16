"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, lightMode } = useUiStore();
  return (
    <div className={`min-h-screen${lightMode ? " light-mode" : " dark-mode"}`}
      style={{ background: lightMode ? "#f0f4ff" : "#0a0f1e", transition:"background 0.3s ease" }}>
      <Sidebar />
      <Header />
      <main className={cn("transition-all duration-300 ease-in-out min-h-screen", sidebarOpen ? "ml-[268px]" : "ml-[72px]")}>
        <div className="pt-[60px]">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
