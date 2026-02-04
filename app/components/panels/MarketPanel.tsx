import { TrendingUp, TrendingDown, Package, ShoppingCart } from 'lucide-react';
import { GOODS } from '../../constants/gameData';
import { calculateProfit } from '../../utils/price';
import { getStockStatus } from '../../utils/stock';

interface MarketPanelProps {
  currentCity: string;
  prices: Record<string, Record<string, number>>;
  inventory: Record<string, number>;
  averagePrices: Record<string, number>;
  selectedGood: string;
  onSelectGood: (good: string) => void;
  stocks?: Record<string, number>;
  getMaxStock?: (good: string) => number;
  onQuickBuy?: (good: string) => void;
  onGoToTrade?: (good: string) => void;
}

const stockStatusStyles = {
  plenty: 'bg-green-600 text-white',
  normal: 'bg-yellow-600 text-white',
  low: 'bg-orange-600 text-white',
  empty: 'bg-red-700 text-white'
};

const stockStatusText = {
  plenty: '풍부',
  normal: '보통',
  low: '부족',
  empty: '품절'
};

export function MarketPanel({
  currentCity,
  prices,
  inventory,
  averagePrices,
  selectedGood,
  onSelectGood,
  stocks = {},
  getMaxStock,
  onQuickBuy,
  onGoToTrade
}: MarketPanelProps) {
  return (
    <div className="parchment rounded-xl p-3 md:p-4 text-[#3d2314]">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 border-b-2 border-[#3d2314]/30 pb-2">
        <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
        시장 시세
        <span className="text-xs font-normal text-[#3d2314]/60 ml-auto">탭하여 거래</span>
      </h2>
      <div className="space-y-1.5 md:space-y-2">
        {Object.keys(GOODS).map(good => {
          const price = prices[currentCity][good];
          const amount = inventory[good] || 0;
          const avgPrice = averagePrices[good] || 0;
          const profit = calculateProfit(good, inventory, averagePrices, prices[currentCity]);
          const isOrigin = GOODS[good].origin.includes(currentCity);
          const stock = stocks[good] ?? 0;
          const maxStock = getMaxStock?.(good) ?? 50;
          const stockStatus = getStockStatus(stock, maxStock);

          return (
            <div
              key={good}
              className={`p-2.5 md:p-3 rounded-lg cursor-pointer transition-all border-2 active:scale-[0.98] ${
                selectedGood === good
                  ? 'bg-[#c9a227]/30 border-[#c9a227]'
                  : 'bg-white/30 border-transparent hover:bg-white/50'
              } ${stockStatus === 'empty' ? 'opacity-60' : ''}`}
              onClick={() => {
                onSelectGood(good);
                if (onGoToTrade) onGoToTrade(good);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-lg md:text-xl">{GOODS[good].icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm md:text-base">{good}</span>
                      {isOrigin && (
                        <span className="text-[10px] bg-green-700 text-white px-1 py-0.5 rounded leading-none">
                          원산지
                        </span>
                      )}
                      {GOODS[good].perishable && (
                        <span className="text-[10px] bg-orange-600 text-white px-1 py-0.5 rounded leading-none">
                          부패
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                      <span className={`text-[10px] px-1 py-0.5 rounded leading-none ${stockStatusStyles[stockStatus]}`}>
                        {stockStatusText[stockStatus]}
                      </span>
                      <span className="opacity-60 text-[11px]">{stock}개</span>
                      {amount > 0 && (
                        <span className="opacity-60 text-[11px]">· 보유 {amount}개</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <div className="font-bold text-base md:text-lg">{price.toLocaleString()}</div>
                    {amount > 0 && (
                      <div
                        className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                          profit > 0 ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {profit > 0 ? (
                          <TrendingUp className="inline w-3 h-3" />
                        ) : (
                          <TrendingDown className="inline w-3 h-3" />
                        )}
                        {profit > 0 ? '+' : ''}
                        {profit.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {/* 모바일에서만 보이는 거래 이동 화살표 */}
                  <div className="md:hidden text-[#c9a227]/50">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
