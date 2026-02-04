'use client';

import { Store, ArrowRightLeft, Navigation, Package, Ship, Scroll } from 'lucide-react';

export type TabType = 'market' | 'trade' | 'navigate' | 'cargo' | 'shipyard' | 'quest';

interface MobileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'market' as TabType, label: '시장', icon: Store },
  { id: 'trade' as TabType, label: '거래', icon: ArrowRightLeft },
  { id: 'navigate' as TabType, label: '항해', icon: Navigation },
  { id: 'quest' as TabType, label: '의뢰', icon: Scroll },
  { id: 'shipyard' as TabType, label: '조선', icon: Ship },
  { id: 'cargo' as TabType, label: '화물', icon: Package },
];

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="md:hidden sticky top-0 z-40 -mx-3 px-1.5 py-1.5 bg-[#0c1929]/95 backdrop-blur-sm border-b border-[#c9a227]/30 mb-3">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center px-2 py-1 rounded-lg transition-all ${
              activeTab === id
                ? 'bg-[#c9a227]/20 text-[#c9a227] border border-[#c9a227]/40'
                : 'text-[#d4c49c]/70 active:bg-[#c9a227]/10'
            }`}
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className={`text-[10px] leading-tight ${activeTab === id ? 'font-bold' : 'font-medium'}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
