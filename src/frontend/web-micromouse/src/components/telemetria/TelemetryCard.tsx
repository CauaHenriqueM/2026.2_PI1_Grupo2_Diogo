interface TelemetryCardProps {
  title: string;
  children: React.ReactNode;
}

export function TelemetryCard({
  title,
  children,
}: TelemetryCardProps) {
  return (
    <div
      className="
        min-w-0 rounded-xl
        border border-[#1D293D]/60
        bg-[#0B1628]
        p-4 sm:p-5
        shadow-[0_2px_6px_rgba(0,0,0,0.06)]
      "
    >
      <span className="mb-3 block text-sm font-medium text-[#DCE1E9]">
        {title}
      </span>

      {children}
    </div>
  );
}