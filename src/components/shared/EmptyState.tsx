interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
}
export default function EmptyState({ title, description, action, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ background: "rgba(255,255,255,0.05)" }}>{icon}</div>
      <h3 className="text-base font-semibold" style={{ color: "rgba(180,205,255,0.8)" }}>{title}</h3>
      {description && <p className="text-sm mt-1.5 max-w-xs leading-relaxed" style={{ color: "rgba(100,130,200,0.5)" }}>{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
