import { CITIES, GOODS } from '../constants/gameData';
import type { Rumor } from '../types';

/**
 * 초기 가격 계산
 * @param useRandom - 랜덤 변동 사용 여부 (SSR에서는 false)
 */
export function calculateInitialPrices(useRandom = false): Record<string, Record<string, number>> {
  const initialPrices: Record<string, Record<string, number>> = {};

  Object.keys(CITIES).forEach(city => {
    initialPrices[city] = {};
    Object.keys(GOODS).forEach(good => {
      const basePrice = GOODS[good].basePrice;
      const isOrigin = GOODS[good].origin.includes(city);

      if (useRandom) {
        const price = isOrigin
          ? Math.round(basePrice * 0.7 * (0.9 + Math.random() * 0.2))
          : Math.round(basePrice * 1.3 * (0.9 + Math.random() * 0.2));
        initialPrices[city][good] = price;
      } else {
        const price = isOrigin
          ? Math.round(basePrice * 0.7)
          : Math.round(basePrice * 1.3);
        initialPrices[city][good] = price;
      }
    });
  });

  return initialPrices;
}

/**
 * 소문 효과를 반영하여 가격 업데이트
 */
export function updatePricesWithRumors(
  currentPrices: Record<string, Record<string, number>>,
  rumors: Rumor[]
): Record<string, Record<string, number>> {
  const newPrices = { ...currentPrices };

  // 소문 효과 적용
  rumors.forEach(rumor => {
    if (rumor.type === 'demand' || rumor.type === 'supply' || rumor.type === 'monopoly') {
      if (newPrices[rumor.city] && newPrices[rumor.city][rumor.good]) {
        newPrices[rumor.city][rumor.good] = Math.round(
          newPrices[rumor.city][rumor.good] * rumor.effect
        );
      }
    }
  });

  // 랜덤 가격 변동
  Object.keys(CITIES).forEach(city => {
    Object.keys(GOODS).forEach(good => {
      const basePrice = GOODS[good].basePrice;
      const isOrigin = GOODS[good].origin.includes(city);
      const currentPrice = newPrices[city][good];
      const change = 0.9 + Math.random() * 0.2;
      const newPrice = Math.round(currentPrice * change);
      const minPrice = isOrigin ? basePrice * 0.5 : basePrice * 0.8;
      const maxPrice = isOrigin ? basePrice * 1.2 : basePrice * 2;
      newPrices[city][good] = Math.max(minPrice, Math.min(maxPrice, newPrice));
    });
  });

  return newPrices;
}

/**
 * 특정 상품의 예상 이익 계산
 */
export function calculateProfit(
  good: string,
  inventory: Record<string, number>,
  averagePrices: Record<string, number>,
  currentPrices: Record<string, number>
): number {
  const amount = inventory[good] || 0;
  const avgPrice = averagePrices[good] || 0;
  const currentPrice = currentPrices[good];
  return (currentPrice - avgPrice) * amount;
}

/**
 * 최대 구매 가능 수량 계산
 */
export function calculateMaxBuyQuantity(
  good: string,
  gold: number,
  inventory: Record<string, number>,
  prices: Record<string, number>,
  maxCargo: number
): number {
  const price = prices[good];
  const currentCargo = Object.values(inventory).reduce((a, b) => a + b, 0);
  const availableSpace = maxCargo - currentCargo;
  const affordableQuantity = Math.floor(gold / price);
  return Math.max(0, Math.min(availableSpace, affordableQuantity));
}
