import type { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  iconColor?: string;
}

export function StatusCard({
  icon: Icon,
  label,
  value,
  subValue,
  iconColor = 'text-[#c9a227]'
}: StatusCardProps) {
  return (
    <div className="parchment rounded-lg p-3 text-[#3d2314]">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div className="flex-1">
          <div className="text-xs opacity-70">{label}</div>
          <div className="font-bold text-sm">{value}</div>
          {subValue && <div className="text-xs opacity-70">{subValue}</div>}
        </div>
      </div>
    </div>
  );
}
