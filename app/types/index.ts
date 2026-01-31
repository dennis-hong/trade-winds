// 도시 데이터 타입
export interface CityData {
  connections: string[];
  distances: Record<string, number>;
  risk: Record<string, number>;
  description: string;
  specialty: string;
}

// 상품 데이터 타입
export interface GoodData {
  basePrice: number;
  origin: string[];
  perishable: boolean;
  icon: string;
}

// 소문 타입
export interface Rumor {
  text: string;
  city: string;
  good: string;
  type: 'demand' | 'supply' | 'monopoly' | 'pirate' | 'plague';
  effect: number;
  reliability: boolean;
}

// 이벤트 타입
export interface GameEvent {
  title: string;
  message: string;
  type: 'danger' | 'success' | 'warning';
}

// 칭호 정보 타입
export interface TitleInfo {
  title: string;
  icon: string;
  color: string;
}

// 무역 추천 타입
export interface TradeRecommendation {
  text: string;
  profit: number;
}

// 최적 거래 정보 타입
export interface BestTradeInfo {
  bestGood: string;
  bestProfit: number;
}

// 게임 상태 타입
export interface GameState {
  gold: number;
  currentCity: string;
  year: number;
  month: number;
  inventory: Record<string, number>;
  averagePrices: Record<string, number>;
  shipCondition: number;
  crew: number;
  prices: Record<string, Record<string, number>>;
  logs: string[];
  rumors: Rumor[];
  tradeCount: number;
  highestAssets: number;
}

// 게임 액션 타입
export type GameAction =
  | { type: 'BUY_GOOD'; good: string; quantity: number; price: number }
  | { type: 'SELL_GOOD'; good: string; quantity: number; price: number }
  | { type: 'TRAVEL'; destination: string; cost: number; distance: number }
  | { type: 'REPAIR_SHIP'; cost: number }
  | { type: 'HIRE_CREW'; count: number; cost: number }
  | { type: 'SET_PRICES'; prices: Record<string, Record<string, number>> }
  | { type: 'SET_RUMORS'; rumors: Rumor[] }
  | { type: 'ADD_LOG'; message: string }
  | { type: 'APPLY_EVENT'; event: 'pirate' | 'storm' | 'illness'; data: Record<string, number> };
