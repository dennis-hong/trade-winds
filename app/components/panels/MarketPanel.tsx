import { TrendingUp, TrendingDown, Package } from 'lucide-react';
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
  getMaxStock
}: MarketPanelProps) {
  return (
    <div className="parchment rounded-xl p-4 text-[#3d2314]">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 border-[#3d2314]/30 pb-2">
        <TrendingUp className="w-6 h-6" />
        시장 시세
      </h2>
      <div className="space-y-2">
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
              className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                selectedGood === good
                  ? 'bg-[#c9a227]/30 border-[#c9a227]'
                  : 'bg-white/30 border-transparent hover:bg-white/50'
              } ${stockStatus === 'empty' ? 'opacity-60' : ''}`}
              onClick={() => onSelectGood(good)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">{GOODS[good].icon}</span>
                    <span className="font-bold">{good}</span>
                    {isOrigin && (
                      <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">
                        원산지
                      </span>
                    )}
                    {GOODS[good].perishable && (
                      <span className="text-xs bg-orange-600 text-white px-1.5 py-0.5 rounded">
                        부패품
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Package className="w-3.5 h-3.5 opacity-70" />
                    <span className={`text-xs px-1.5 py-0.5 rounded ${stockStatusStyles[stockStatus]}`}>
                      {stockStatusText[stockStatus]}
                    </span>
                    <span className="opacity-70">{stock}개</span>
                  </div>
                  {amount > 0 && (
                    <div className="text-sm opacity-70 mt-1">
                      보유: {amount}개 | 평단가: {avgPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{price.toLocaleString()}</div>
                  {amount > 0 && (
                    <div
                      className={`text-sm font-semibold ${
                        profit > 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {profit > 0 ? (
                        <TrendingUp className="inline w-4 h-4" />
                      ) : (
                        <TrendingDown className="inline w-4 h-4" />
                      )}
                      {profit > 0 ? '+' : ''}
                      {profit.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
