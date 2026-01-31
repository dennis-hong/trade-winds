import { CITIES, GOODS, GAME_CONFIG } from '../constants/gameData';

// 도시별 재고 타입
export type CityStocks = Record<string, Record<string, number>>;

// 상품의 기본 재고량 계산
function getBaseStock(city: string, good: string): number {
  const cityData = CITIES[city];
  const goodData = GOODS[good];

  // 특산품이면 많이
  if (cityData.specialty === good) {
    return GAME_CONFIG.STOCK_SPECIALTY;
  }

  // 원산지면 많이
  if (goodData.origin.includes(city)) {
    return GAME_CONFIG.STOCK_SPECIALTY;
  }

  // 먼 도시는 희귀품
  const distance = getMinDistanceFromOrigin(city, good);
  if (distance > 20) {
    return GAME_CONFIG.STOCK_RARE;
  }

  return GAME_CONFIG.STOCK_BASE;
}

// 원산지로부터의 최소 거리 (간단한 휴리스틱)
function getMinDistanceFromOrigin(city: string, good: string): number {
  const origins = GOODS[good].origin;
  if (origins.includes(city)) return 0;
  
  // 간단한 거리 추정 (실제로는 그래프 탐색이 필요하지만 간단히)
  let minDist = 100;
  for (const origin of origins) {
    const cityData = CITIES[city];
    if (cityData.distances[origin]) {
      minDist = Math.min(minDist, cityData.distances[origin]);
    }
  }
  return minDist;
}

// 초기 재고 생성
export function initializeStocks(): CityStocks {
  const stocks: CityStocks = {};

  for (const city of Object.keys(CITIES)) {
    stocks[city] = {};
    for (const good of Object.keys(GOODS)) {
      const base = getBaseStock(city, good);
      // 약간의 랜덤 변동 (80% ~ 120%)
      const variation = 0.8 + Math.random() * 0.4;
      stocks[city][good] = Math.round(base * variation);
    }
  }

  return stocks;
}

// 최대 재고량
export function getMaxStock(city: string, good: string): number {
  return Math.round(getBaseStock(city, good) * GAME_CONFIG.STOCK_MAX_MULTIPLIER);
}

// 시간 경과에 따른 재고 리필
export function refillStocks(stocks: CityStocks, monthsPassed: number): CityStocks {
  const newStocks: CityStocks = {};

  for (const city of Object.keys(CITIES)) {
    newStocks[city] = { ...stocks[city] };
    for (const good of Object.keys(GOODS)) {
      const current = stocks[city]?.[good] ?? 0;
      const maxStock = getMaxStock(city, good);
      const baseStock = getBaseStock(city, good);

      // 월별 회복량 계산
      const refillAmount = Math.round(baseStock * GAME_CONFIG.STOCK_REFILL_RATE * monthsPassed);
      newStocks[city][good] = Math.min(maxStock, current + refillAmount);
    }
  }

  return newStocks;
}

// 재고 차감
export function reduceStock(
  stocks: CityStocks,
  city: string,
  good: string,
  quantity: number
): CityStocks {
  const newStocks = { ...stocks };
  newStocks[city] = { ...stocks[city] };
  newStocks[city][good] = Math.max(0, (stocks[city]?.[good] ?? 0) - quantity);
  return newStocks;
}

// 재고 상태 (UI 표시용)
export function getStockStatus(stock: number, maxStock: number): 'plenty' | 'normal' | 'low' | 'empty' {
  if (stock === 0) return 'empty';
  const ratio = stock / maxStock;
  if (ratio > 0.6) return 'plenty';
  if (ratio > 0.2) return 'normal';
  return 'low';
}
