import { Coins } from 'lucide-react';

interface MobileStatBarProps {
  gold: number;
  totalAssets: number;
  titleIcon: string;
}

export function MobileStatBar({ gold, totalAssets, titleIcon }: MobileStatBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#2a1810]/95 backdrop-blur-sm border-t-2 border-[#c9a227] px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* 보유 금화 */}
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-sm">
                {gold.toLocaleString()}
              </div>
              <div className="text-[#d4c49c] text-[10px]">보유 금화</div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-8 bg-[#c9a227]/30" />

          {/* 총 자산 */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{titleIcon}</span>
            <div className="text-center">
              <div className="text-[#c9a227] font-bold text-sm">
                {totalAssets.toLocaleString()}
              </div>
              <div className="text-[#d4c49c] text-[10px]">총 자산</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
