import { CITIES, GOODS } from '../constants/gameData';
import type { TradeRecommendation, BestTradeInfo } from '../types';

/**
 * 목적지에 대한 최적 거래 정보 계산
 */
export function calculateBestTrade(
  destination: string,
  currentCity: string,
  inventory: Record<string, number>,
  averagePrices: Record<string, number>,
  prices: Record<string, Record<string, number>>
): BestTradeInfo {
  let bestProfit = 0;
  let bestGood = '';

  // 현재 보유 상품 판매 기회 확인
  Object.entries(inventory).forEach(([good, amount]) => {
    if (amount > 0) {
      const destPrice = prices[destination][good];
      const avgPrice = averagePrices[good] || 0;
      const profit = (destPrice - avgPrice) * amount;
      if (profit > bestProfit) {
        bestProfit = profit;
        bestGood = good;
      }
    }
  });

  // 구매 기회 확인 (원산지 상품)
  Object.entries(GOODS).forEach(([good, data]) => {
    if (data.origin.includes(currentCity)) {
      const buyPrice = prices[currentCity][good];
      const sellPrice = prices[destination][good];
      const potentialProfit = sellPrice - buyPrice;
      if (potentialProfit > bestProfit / 10) {
        bestProfit = potentialProfit;
        bestGood = good;
      }
    }
  });

  return { bestGood, bestProfit };
}

/**
 * 무역 추천 생성
 */
export function getTradingRecommendations(
  currentCity: string,
  prices: Record<string, Record<string, number>>
): TradeRecommendation[] {
  const recommendations: TradeRecommendation[] = [];

  Object.keys(CITIES).forEach(destCity => {
    if (destCity === currentCity) return;

    Object.entries(GOODS).forEach(([good, data]) => {
      if (data.origin.includes(currentCity)) {
        const buyPrice = prices[currentCity][good];
        const sellPrice = prices[destCity][good];
        const profitPercent = Math.round(((sellPrice - buyPrice) / buyPrice) * 100);

        if (profitPercent > 50) {
          recommendations.push({
            text: `${currentCity}의 ${data.icon} ${good}을(를) ${destCity}에서 팔면 약 ${profitPercent}% 이익!`,
            profit: profitPercent
          });
        }
      }
    });
  });

  return recommendations.sort((a, b) => b.profit - a.profit).slice(0, 3);
}

/**
 * 평균 구매가 계산 (새 구매 시)
 */
export function calculateNewAveragePrice(
  currentAmount: number,
  currentAvgPrice: number,
  newQuantity: number,
  newPrice: number
): number {
  const newAmount = currentAmount + newQuantity;
  return Math.round((currentAvgPrice * currentAmount + newPrice * newQuantity) / newAmount);
}
