'use client';

import { Store, ArrowRightLeft, Navigation, Package, Ship } from 'lucide-react';

export type TabType = 'market' | 'trade' | 'navigate' | 'cargo' | 'shipyard';

interface MobileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'market' as TabType, label: '시장', icon: Store },
  { id: 'trade' as TabType, label: '거래', icon: ArrowRightLeft },
  { id: 'navigate' as TabType, label: '항해', icon: Navigation },
  { id: 'shipyard' as TabType, label: '조선소', icon: Ship },
  { id: 'cargo' as TabType, label: '화물', icon: Package },
];

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="md:hidden sticky top-0 z-40 -mx-4 px-4 py-2 bg-[#0c1929]/95 backdrop-blur-sm border-b border-[#c9a227]/30 mb-4">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === id
                ? 'bg-[#c9a227]/20 text-[#c9a227]'
                : 'text-[#d4c49c] hover:text-[#c9a227]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
