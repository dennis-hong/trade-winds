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
    <div className="parchment rounded-xl p-4 text-[#3d2314]">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 border-[#3d2314]/30 pb-2">
        <Package className="w-6 h-6" />
        선창 화물
      </h2>
      {Object.entries(inventory).length === 0 ? (
        <div className="text-center py-8 opacity-50">
          <Package className="w-12 h-12 mx-auto mb-2" />
          <p>화물창이 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(inventory).map(([good, amount]) => {
            const currentPrice = prices[currentCity][good];
            const avgPrice = averagePrices[good] || 0;
            const totalValue = currentPrice * amount;
            const profit = (currentPrice - avgPrice) * amount;
            const profitPercent = avgPrice > 0 ? Math.round(((currentPrice - avgPrice) / avgPrice) * 100) : 0;

            return (
              <div key={good} className="p-3 bg-white/40 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{GOODS[good].icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{good}</span>
                        {GOODS[good].perishable && (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <div className="text-sm opacity-70">보유: {amount}개</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSellAll(good)}
                    className="btn-gold rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <Coins className="w-4 h-4" />
                    전량 판매
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm bg-[#3d2314]/10 rounded p-2">
                  <div>
                    <span className="opacity-70">매입 단가:</span>
                    <span className="font-semibold ml-1">{avgPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="opacity-70">현재 시세:</span>
                    <span className="font-semibold ml-1">{currentPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="opacity-70">예상 수익:</span>
                    <span className={`font-bold ml-1 ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {profit >= 0 ? '+' : ''}{totalValue.toLocaleString()}
                      <span className="text-xs ml-1">
                        ({profit >= 0 ? '+' : ''}{profit.toLocaleString()})
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">수익률:</span>
                    <span className={`font-bold ml-1 ${profitPercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {profitPercent >= 0 ? '+' : ''}{profitPercent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
