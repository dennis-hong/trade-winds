import { Coins, MapPin, Package } from 'lucide-react';

interface MobileStatBarProps {
  gold: number;
  totalAssets: number;
  titleIcon: string;
  currentCity?: string;
  totalCargo?: number;
  maxCargo?: number;
}

export function MobileStatBar({ gold, totalAssets, titleIcon, currentCity, totalCargo = 0, maxCargo = 100 }: MobileStatBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#2a1810]/95 backdrop-blur-sm border-t-2 border-[#c9a227] px-3 py-1.5 safe-area-bottom">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* 보유 금화 */}
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-yellow-400 font-bold text-xs leading-tight">
                {gold.toLocaleString()}
              </div>
              <div className="text-[#d4c49c] text-[8px] leading-tight">금화</div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-[#c9a227]/30" />

          {/* 총 자산 */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{titleIcon}</span>
            <div>
              <div className="text-[#c9a227] font-bold text-xs leading-tight">
                {totalAssets.toLocaleString()}
              </div>
              <div className="text-[#d4c49c] text-[8px] leading-tight">총 자산</div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-[#c9a227]/30" />

          {/* 화물 */}
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-amber-400 font-bold text-xs leading-tight">
                {totalCargo}/{maxCargo}
              </div>
              <div className="text-[#d4c49c] text-[8px] leading-tight">화물</div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-[#c9a227]/30" />

          {/* 현재 위치 */}
          {currentCity && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-emerald-400 font-bold text-xs leading-tight">
                  {currentCity}
                </div>
                <div className="text-[#d4c49c] text-[8px] leading-tight">위치</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
