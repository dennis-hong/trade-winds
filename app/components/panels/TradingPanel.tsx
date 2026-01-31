import { Coins, Anchor, Heart, Users, AlertTriangle } from 'lucide-react';
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
  onHireCrew
}: TradingPanelProps) {
  const price = prices[currentCity][selectedGood];
  const profit = calculateProfit(selectedGood, inventory, averagePrices, prices[currentCity]);
  const maxBuyQty = getMaxBuyQuantity(selectedGood);
  const inventoryAmount = inventory[selectedGood] || 0;
  const totalCost = price * quantity;
  const balanceAfterBuy = gold - totalCost;
  const isInsufficientFunds = balanceAfterBuy < 0;

  return (
    <div className="parchment rounded-xl p-4 text-[#3d2314]">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 border-[#3d2314]/30 pb-2">
        <Coins className="w-6 h-6" />
        거래소
      </h2>

      <div className="bg-white/40 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{GOODS[selectedGood].icon}</span>
          <div>
            <h3 className="font-bold text-xl">{selectedGood}</h3>
            <p className="text-sm opacity-70">
              현재가: <span className="font-bold">{price.toLocaleString()}</span> 두카트
            </p>
          </div>
        </div>

        {inventoryAmount > 0 && (
          <div className="bg-[#3d2314]/10 rounded p-2 mb-3">
            <p className="text-sm">평균 매입가: {averagePrices[selectedGood]?.toLocaleString()} 두카트</p>
            <p className={`font-bold ${profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
              예상 이익: {profit > 0 ? '+' : ''}{profit.toLocaleString()} 두카트
            </p>
          </div>
        )}

        {/* Quick quantity buttons */}
        <div className="mb-3">
          <label className="text-sm font-semibold block mb-1">빠른 선택</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10].map(qty => (
              <button
                key={qty}
                onClick={() => onQuantityChange(qty)}
                className={`py-2 rounded-lg border-2 font-bold transition-all ${
                  quantity === qty
                    ? 'bg-[#c9a227] text-white border-[#c9a227]'
                    : 'bg-white/50 border-[#3d2314]/30 hover:bg-white/70'
                }`}
              >
                {qty}개
              </button>
            ))}
            <button
              onClick={() => onQuantityChange(maxBuyQty)}
              className="py-2 rounded-lg border-2 font-bold bg-amber-600 text-white border-amber-700 hover:bg-amber-500 transition-all"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Quantity input with +/- buttons */}
        <div className="mb-3">
          <label className="text-sm font-semibold block mb-1">수량</label>
          <div className="flex gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-[#3d2314]/30 bg-white/70 hover:bg-white text-[#3d2314] font-bold text-2xl transition-all active:scale-95"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 p-3 rounded-lg border-2 border-[#3d2314]/30 bg-white/70 text-[#3d2314] font-bold text-lg text-center"
              min="1"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-[#3d2314]/30 bg-white/70 hover:bg-white text-[#3d2314] font-bold text-2xl transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Trade preview */}
        <div className={`rounded-lg p-3 mb-3 text-sm space-y-1 ${
          isInsufficientFunds ? 'bg-red-100 border-2 border-red-300' : 'bg-[#3d2314]/10'
        }`}>
          <div className="flex justify-between">
            <span>총 비용 (구매 시):</span>
            <span className="font-bold text-red-700">
              {totalCost.toLocaleString()} 두카트
            </span>
          </div>
          <div className="flex justify-between">
            <span>총 수익 (판매 시):</span>
            <span className="font-bold text-green-700">
              {totalCost.toLocaleString()} 두카트
            </span>
          </div>
          <div className={`flex justify-between border-t pt-1 mt-1 ${
            isInsufficientFunds ? 'border-red-300' : 'border-[#3d2314]/20'
          }`}>
            <span>거래 후 잔액 (구매):</span>
            <span className={`font-bold ${isInsufficientFunds ? 'text-red-600' : ''}`}>
              {balanceAfterBuy.toLocaleString()} 두카트
            </span>
          </div>
          {isInsufficientFunds && (
            <div className="flex items-center gap-1 text-red-600 font-semibold pt-1">
              <AlertTriangle className="w-4 h-4" />
              <span>잔액 부족!</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>거래 후 잔액 (판매):</span>
            <span className="font-bold text-green-700">
              {(gold + totalCost).toLocaleString()} 두카트
            </span>
          </div>
          <div className="flex justify-between text-[#c9a227]">
            <span>최대 구매 가능:</span>
            <span className="font-bold">{maxBuyQty.toLocaleString()}개</span>
          </div>
        </div>

        {/* Max buy / Sell all buttons */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <button
            onClick={onBuyMax}
            disabled={maxBuyQty === 0}
            className={`rounded-lg py-2 font-bold flex flex-col items-center ${
              maxBuyQty > 0
                ? 'btn-gold opacity-90 hover:opacity-100'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">최대 구매 ({maxBuyQty}개)</span>
            <span className="text-xs opacity-90">
              -{(price * maxBuyQty).toLocaleString()} 두카트
            </span>
          </button>
          <button
            onClick={onSellAll}
            disabled={!inventoryAmount}
            className={`rounded-lg py-2 font-bold flex flex-col items-center ${
              inventoryAmount
                ? 'btn-success opacity-90 hover:opacity-100'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">전량 판매 ({inventoryAmount}개)</span>
            <span className="text-xs opacity-90">
              +{(price * inventoryAmount).toLocaleString()} 두카트
            </span>
          </button>
        </div>

        {/* Regular buy/sell buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBuy}
            disabled={isInsufficientFunds}
            className={`rounded-lg py-3 font-bold flex flex-col items-center ${
              !isInsufficientFunds
                ? 'btn-gold'
                : 'bg-red-200 text-red-600 cursor-not-allowed border-2 border-red-300'
            }`}
          >
            <span className="text-lg flex items-center gap-1">
              {isInsufficientFunds && <AlertTriangle className="w-4 h-4" />}
              구매 ({quantity}개)
            </span>
            <span className="text-xs opacity-90">
              -{totalCost.toLocaleString()} 두카트
            </span>
          </button>
          <button
            onClick={onSell}
            disabled={!inventoryAmount || inventoryAmount < quantity}
            className={`rounded-lg py-3 font-bold flex flex-col items-center ${
              inventoryAmount && inventoryAmount >= quantity
                ? 'btn-success'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-lg">판매 ({quantity}개)</span>
            <span className="text-xs opacity-90">
              +{(price * quantity).toLocaleString()} 두카트
            </span>
          </button>
        </div>
      </div>

      {/* Ship Management */}
      <div className="border-t-2 border-[#3d2314]/30 pt-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Anchor className="w-5 h-5" />
          선박 관리
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRepairShip}
            className="btn-wood rounded-lg py-2 text-sm flex items-center justify-center gap-1"
          >
            <Heart className="w-4 h-4" />
            수리 ({((GAME_CONFIG.MAX_SHIP_CONDITION - shipCondition) * GAME_CONFIG.REPAIR_COST_PER_POINT).toLocaleString()})
          </button>
          <button
            onClick={onHireCrew}
            className="btn-wood rounded-lg py-2 text-sm flex items-center justify-center gap-1"
          >
            <Users className="w-4 h-4" />
            고용 ({GAME_CONFIG.CREW_HIRE_COUNT * GAME_CONFIG.CREW_HIRE_COST})
          </button>
        </div>
      </div>
    </div>
  );
}
