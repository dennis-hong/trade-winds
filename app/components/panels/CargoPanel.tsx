import { Package, AlertTriangle, Coins } from 'lucide-react';
import { GOODS } from '../../constants/gameData';

interface CargoPanelProps {
  inventory: Record<string, number>;
  averagePrices: Record<string, number>;
  currentCity: string;
  prices: Record<string, Record<string, number>>;
  onSellAll: (good: string) => void;
}

export function CargoPanel({
  inventory,
  averagePrices,
  currentCity,
  prices,
  onSellAll
}: CargoPanelProps) {
  return (
    <div className="parchment rounded-xl p-3 md:p-4 text-[#3d2314]">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 border-b-2 border-[#3d2314]/30 pb-2">
        <Package className="w-5 h-5 md:w-6 md:h-6" />
        선창 화물
      </h2>
      {Object.entries(inventory).length === 0 ? (
        <div className="text-center py-6 md:py-8 opacity-50">
          <Package className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2" />
          <p className="text-sm md:text-base">화물창이 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {Object.entries(inventory).map(([good, amount]) => {
            const currentPrice = prices[currentCity][good];
            const avgPrice = averagePrices[good] || 0;
            const totalValue = currentPrice * amount;
            const profit = (currentPrice - avgPrice) * amount;
            const profitPercent = avgPrice > 0 ? Math.round(((currentPrice - avgPrice) / avgPrice) * 100) : 0;

            return (
              <div key={good} className="p-2.5 md:p-3 bg-white/40 rounded-lg">
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl md:text-2xl">{GOODS[good].icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm md:text-lg">{good}</span>
                        <span className="text-xs opacity-60">{amount}개</span>
                        {GOODS[good].perishable && (
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        )}
                      </div>
                      <div className={`text-xs font-semibold ${profitPercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {profitPercent >= 0 ? '▲' : '▼'} {profitPercent >= 0 ? '+' : ''}{profitPercent}%
                        <span className="font-normal opacity-70 ml-1">
                          ({profit >= 0 ? '+' : ''}{profit.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSellAll(good)}
                    className="btn-gold rounded-lg px-3 py-2 text-xs md:text-sm font-bold flex items-center gap-1 active:scale-95 transition-transform min-h-[40px]"
                  >
                    <Coins className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden md:inline">전량 판매</span>
                    <span className="md:hidden">판매</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-sm bg-[#3d2314]/10 rounded p-1.5 md:p-2">
                  <span>매입 {avgPrice.toLocaleString()}</span>
                  <span>→</span>
                  <span>시세 {currentPrice.toLocaleString()}</span>
                  <span className="ml-auto font-bold">총 {totalValue.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
