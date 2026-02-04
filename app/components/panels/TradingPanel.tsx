import { Coins, Anchor, Heart, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import { GOODS, GAME_CONFIG } from '../../constants/gameData';
import { calculateProfit } from '../../utils/price';

interface TradingPanelProps {
  selectedGood: string;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  gold: number;
  currentCity: string;
  prices: Record<string, Record<string, number>>;
  inventory: Record<string, number>;
  averagePrices: Record<string, number>;
  shipCondition: number;
  getMaxBuyQuantity: (good: string) => number;
  onBuy: () => void;
  onSell: () => void;
  onBuyMax: () => void;
  onSellAll: () => void;
  onRepairShip: () => void;
  onHireCrew: () => void;
  onBackToMarket?: () => void;
}

export function TradingPanel({
  selectedGood,
  quantity,
  onQuantityChange,
  gold,
  currentCity,
  prices,
  inventory,
  averagePrices,
  shipCondition,
  getMaxBuyQuantity,
  onBuy,
  onSell,
  onBuyMax,
  onSellAll,
  onRepairShip,
  onHireCrew,
  onBackToMarket
}: TradingPanelProps) {
  const price = prices[currentCity][selectedGood];
  const profit = calculateProfit(selectedGood, inventory, averagePrices, prices[currentCity]);
  const maxBuyQty = getMaxBuyQuantity(selectedGood);
  const inventoryAmount = inventory[selectedGood] || 0;
  const totalCost = price * quantity;
  const balanceAfterBuy = gold - totalCost;
  const isInsufficientFunds = balanceAfterBuy < 0;

  return (
    <div className="parchment rounded-xl p-3 md:p-4 text-[#3d2314]">
      <div className="flex items-center gap-2 mb-3 md:mb-4 border-b-2 border-[#3d2314]/30 pb-2">
        {/* 모바일 뒤로가기 */}
        {onBackToMarket && (
          <button
            onClick={onBackToMarket}
            className="md:hidden min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-[#3d2314]/10 active:bg-[#3d2314]/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <Coins className="w-5 h-5 md:w-6 md:h-6" />
        <h2 className="text-lg md:text-2xl font-bold">거래소</h2>
      </div>

      <div className="bg-white/40 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
        {/* 상품 정보 헤더 */}
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <span className="text-2xl md:text-3xl">{GOODS[selectedGood].icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg md:text-xl">{selectedGood}</h3>
            <p className="text-xs md:text-sm opacity-70">
              현재가: <span className="font-bold">{price.toLocaleString()}</span> 두카트
              {inventoryAmount > 0 && (
                <span className="ml-2">· 보유 {inventoryAmount}개</span>
              )}
            </p>
          </div>
        </div>

        {inventoryAmount > 0 && (
          <div className="bg-[#3d2314]/10 rounded p-2 mb-2 md:mb-3 text-xs md:text-sm">
            <div className="flex items-center justify-between">
              <span>매입 단가: {averagePrices[selectedGood]?.toLocaleString()}</span>
              <span className={`font-bold ${profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                이익: {profit > 0 ? '+' : ''}{profit.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Quick quantity buttons - 모바일에서 더 크게 */}
        <div className="mb-2 md:mb-3">
          <div className="grid grid-cols-4 gap-1.5 md:gap-2">
            {[1, 5, 10].map(qty => (
              <button
                key={qty}
                onClick={() => onQuantityChange(qty)}
                className={`min-h-[40px] md:py-2 rounded-lg border-2 font-bold text-sm transition-all active:scale-95 ${
                  quantity === qty
                    ? 'bg-[#c9a227] text-white border-[#c9a227]'
                    : 'bg-white/50 border-[#3d2314]/30 active:bg-white/70'
                }`}
              >
                {qty}개
              </button>
            ))}
            <button
              onClick={() => onQuantityChange(maxBuyQty)}
              className="min-h-[40px] md:py-2 rounded-lg border-2 font-bold text-sm bg-amber-600 text-white border-amber-700 active:bg-amber-500 transition-all active:scale-95"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Quantity input with +/- buttons */}
        <div className="mb-2 md:mb-3">
          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-[#3d2314]/30 bg-white/70 active:bg-white text-[#3d2314] font-bold text-xl transition-all active:scale-95"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 p-2 rounded-lg border-2 border-[#3d2314]/30 bg-white/70 text-[#3d2314] font-bold text-lg text-center min-h-[44px]"
              min="1"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-[#3d2314]/30 bg-white/70 active:bg-white text-[#3d2314] font-bold text-xl transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Trade preview - 모바일에서 컴팩트 */}
        <div className={`rounded-lg p-2 md:p-3 mb-2 md:mb-3 text-xs md:text-sm space-y-0.5 md:space-y-1 ${
          isInsufficientFunds ? 'bg-red-100 border-2 border-red-300' : 'bg-[#3d2314]/10'
        }`}>
          <div className="flex justify-between">
            <span>구매 비용:</span>
            <span className="font-bold text-red-700">
              -{totalCost.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>판매 수익:</span>
            <span className="font-bold text-green-700">
              +{totalCost.toLocaleString()}
            </span>
          </div>
          <div className={`flex justify-between pt-0.5 border-t ${
            isInsufficientFunds ? 'border-red-300' : 'border-[#3d2314]/20'
          }`}>
            <span>구매 후 잔액:</span>
            <span className={`font-bold ${isInsufficientFunds ? 'text-red-600' : ''}`}>
              {balanceAfterBuy.toLocaleString()}
              {isInsufficientFunds && (
                <span className="ml-1 text-red-600">⚠️ 부족</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-[#c9a227]">
            <span>최대 구매 가능:</span>
            <span className="font-bold">{maxBuyQty}개</span>
          </div>
        </div>

        {/* 원탭 매매 - 가장 눈에 띄게 */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2">
          <button
            onClick={onBuyMax}
            disabled={maxBuyQty === 0}
            className={`rounded-lg min-h-[48px] font-bold flex flex-col items-center justify-center ${
              maxBuyQty > 0
                ? 'btn-gold opacity-90 active:opacity-100 active:scale-95'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">최대 구매 ({maxBuyQty}개)</span>
            <span className="text-[10px] md:text-xs opacity-90">
              -{(price * maxBuyQty).toLocaleString()}
            </span>
          </button>
          <button
            onClick={onSellAll}
            disabled={!inventoryAmount}
            className={`rounded-lg min-h-[48px] font-bold flex flex-col items-center justify-center ${
              inventoryAmount
                ? 'btn-success opacity-90 active:opacity-100 active:scale-95'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">전량 판매 ({inventoryAmount}개)</span>
            <span className="text-[10px] md:text-xs opacity-90">
              +{(price * inventoryAmount).toLocaleString()}
            </span>
          </button>
        </div>

        {/* Regular buy/sell buttons */}
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <button
            onClick={onBuy}
            disabled={isInsufficientFunds}
            className={`rounded-lg min-h-[48px] font-bold flex flex-col items-center justify-center ${
              !isInsufficientFunds
                ? 'btn-gold active:scale-95'
                : 'bg-red-200 text-red-600 cursor-not-allowed border-2 border-red-300'
            }`}
          >
            <span className="text-base flex items-center gap-1">
              {isInsufficientFunds && <AlertTriangle className="w-4 h-4" />}
              구매 ({quantity}개)
            </span>
            <span className="text-[10px] md:text-xs opacity-90">
              -{totalCost.toLocaleString()}
            </span>
          </button>
          <button
            onClick={onSell}
            disabled={!inventoryAmount || inventoryAmount < quantity}
            className={`rounded-lg min-h-[48px] font-bold flex flex-col items-center justify-center ${
              inventoryAmount && inventoryAmount >= quantity
                ? 'btn-success active:scale-95'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-base">판매 ({quantity}개)</span>
            <span className="text-[10px] md:text-xs opacity-90">
              +{(price * quantity).toLocaleString()}
            </span>
          </button>
        </div>
      </div>

      {/* Ship Management */}
      <div className="border-t-2 border-[#3d2314]/30 pt-3 md:pt-4">
        <h3 className="font-bold text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
          <Anchor className="w-4 h-4 md:w-5 md:h-5" />
          선박 관리
        </h3>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <button
            onClick={onRepairShip}
            className="btn-wood rounded-lg min-h-[44px] py-2 text-xs md:text-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <Heart className="w-4 h-4" />
            수리 ({((GAME_CONFIG.MAX_SHIP_CONDITION - shipCondition) * GAME_CONFIG.REPAIR_COST_PER_POINT).toLocaleString()})
          </button>
          <button
            onClick={onHireCrew}
            className="btn-wood rounded-lg min-h-[44px] py-2 text-xs md:text-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <Users className="w-4 h-4" />
            고용 ({GAME_CONFIG.CREW_HIRE_COUNT * GAME_CONFIG.CREW_HIRE_COST})
          </button>
        </div>
      </div>
    </div>
  );
}
