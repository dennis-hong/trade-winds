import { ScrollText } from 'lucide-react';

interface LogPanelProps {
  logs: string[];
}

export function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="ocean-card rounded-xl p-3 md:p-4">
      <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
        <ScrollText className="w-5 h-5 md:w-6 md:h-6" />
        항해 일지
      </h2>
      <div className="space-y-1.5 md:space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <p
            key={i}
            className={`text-xs md:text-sm p-1.5 md:p-2 rounded ${
              i === logs.length - 1
                ? 'bg-[#c9a227]/20 text-[#f4e4bc] font-semibold'
                : 'text-[#d4c49c]'
            }`}
          >
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
