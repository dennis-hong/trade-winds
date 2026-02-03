import type { CityData, GoodData, ShipData, ShipUpgrade } from '../types';

// 도시 데이터
export const CITIES: Record<string, CityData> = {
  '리스본': {
    connections: ['세비야', '아프리카'],
    distances: { 세비야: 3, 아프리카: 10 },
    risk: { 세비야: 5, 아프리카: 30 },
    description: '포르투갈의 수도, 대항해의 시작점',
    specialty: '와인'
  },
  '세비야': {
    connections: ['리스본', '베네치아', '신대륙'],
    distances: { 리스본: 3, 베네치아: 7, 신대륙: 40 },
    risk: { 리스본: 5, 베네치아: 15, 신대륙: 70 },
    description: '스페인의 항구, 신대륙 무역의 관문',
    specialty: '올리브유'
  },
  '베네치아': {
    connections: ['세비야', '이스탄불'],
    distances: { 세비야: 7, 이스탄불: 8 },
    risk: { 세비야: 15, 이스탄불: 25 },
    description: '아드리아해의 여왕, 지중해 무역의 중심',
    specialty: '총포'
  },
  '이스탄불': {
    connections: ['베네치아', '알렉산드리아'],
    distances: { 베네치아: 8, 알렉산드리아: 7 },
    risk: { 베네치아: 25, 알렉산드리아: 20 },
    description: '동서양의 교차로, 오스만 제국의 심장',
    specialty: '향신료'
  },
  '알렉산드리아': {
    connections: ['이스탄불', '인도'],
    distances: { 이스탄불: 7, 인도: 25 },
    risk: { 이스탄불: 20, 인도: 50 },
    description: '고대 이집트의 항구, 향료 무역의 요충지',
    specialty: '커피'
  },
  '아프리카': {
    connections: ['리스본', '인도'],
    distances: { 리스본: 10, 인도: 20 },
    risk: { 리스본: 30, 인도: 60 },
    description: '희망봉을 향한 항해, 미지의 대륙',
    specialty: '커피'
  },
  '인도': {
    connections: ['알렉산드리아', '아프리카', '중국'],
    distances: { 알렉산드리아: 25, 아프리카: 20, 중국: 15 },
    risk: { 알렉산드리아: 50, 아프리카: 60, 중국: 40 },
    description: '향신료의 본고장, 부의 원천',
    specialty: '향신료'
  },
  '중국': {
    connections: ['인도', '일본'],
    distances: { 인도: 15, 일본: 5 },
    risk: { 인도: 40, 일본: 15 },
    description: '비단의 제국, 동방의 보물창고',
    specialty: '비단'
  },
  '일본': {
    connections: ['중국'],
    distances: { 중국: 5 },
    risk: { 중국: 15 },
    description: '해 뜨는 나라, 은의 섬',
    specialty: '은'
  },
  '신대륙': {
    connections: ['세비야'],
    distances: { 세비야: 40 },
    risk: { 세비야: 70 },
    description: '새로운 세계, 무한한 가능성',
    specialty: '은'
  }
};

// 상품 데이터
export const GOODS: Record<string, GoodData> = {
  '향신료': { basePrice: 1000, origin: ['인도'], perishable: true, icon: '🌶️' },
  '비단': { basePrice: 800, origin: ['중국'], perishable: false, icon: '🧵' },
  '은': { basePrice: 1500, origin: ['신대륙', '일본'], perishable: false, icon: '🪙' },
  '커피': { basePrice: 600, origin: ['아프리카', '알렉산드리아'], perishable: true, icon: '☕' },
  '총포': { basePrice: 900, origin: ['베네치아'], perishable: false, icon: '🔫' },
  '와인': { basePrice: 300, origin: ['리스본'], perishable: true, icon: '🍷' },
  '올리브유': { basePrice: 350, origin: ['세비야'], perishable: false, icon: '🫒' }
};

// 소문 템플릿
export const RUMOR_TEMPLATES = [
  { text: '{city}에서 {good} 수요 급증 예상', type: 'demand' as const, effect: 1.5 },
  { text: '{city} 항로에 해적선 출몰 주의', type: 'pirate' as const, effect: 1.5 },
  { text: '{good} 풍작으로 {city} 가격 하락 전망', type: 'supply' as const, effect: 0.7 },
  { text: '{city}에서 흑사병 발생, 거래 위축', type: 'plague' as const, effect: 0.5 },
  { text: '{city} 길드가 {good} 독점 계획', type: 'monopoly' as const, effect: 1.3 }
];

// 칭호 기준
export const TITLE_THRESHOLDS = {
  EMPIRE: 100000,
  TRADE_KING: 50000,
  APPRENTICE: 10000
};

// 게임 설정 상수
export const GAME_CONFIG = {
  INITIAL_GOLD: 7500,
  INITIAL_YEAR: 1492,
  INITIAL_MONTH: 1,
  INITIAL_SHIP_CONDITION: 100,
  INITIAL_CREW: 50,
  MAX_CARGO: 100,
  MAX_CREW: 100,
  MIN_CREW: 10,
  MAX_SHIP_CONDITION: 100,
  MIN_SHIP_CONDITION_FOR_TRAVEL: 20,
  REPAIR_COST_PER_POINT: 10,
  CREW_HIRE_COUNT: 10,
  CREW_HIRE_COST: 50,
  TRAVEL_BASE_COST_PER_DISTANCE: 50,
  TRAVEL_CREW_COST_PER_DISTANCE: 2,
  PIRATE_GOLD_LOSS_RATE: 0.3,
  STORM_SHIP_DAMAGE: 20,
  STORM_CARGO_LOSS_RATE: 0.3,
  ILLNESS_CREW_LOSS_RATE: 0.2,
  // 재고 시스템
  STOCK_BASE: 30,           // 일반 재고
  STOCK_SPECIALTY: 80,      // 특산품 재고
  STOCK_RARE: 10,           // 희귀품 재고
  STOCK_REFILL_RATE: 0.2,   // 월별 재고 회복률 (20%)
  STOCK_MAX_MULTIPLIER: 1.5 // 최대 재고 = 기본 재고 * 1.5
};

// 칭호 정보
export const TITLES = [
  { threshold: TITLE_THRESHOLDS.EMPIRE, title: '해상 제국', icon: '👑', color: 'text-purple-400' },
  { threshold: TITLE_THRESHOLDS.TRADE_KING, title: '무역왕', icon: '🏆', color: 'text-yellow-400' },
  { threshold: TITLE_THRESHOLDS.APPRENTICE, title: '견습 상인', icon: '📜', color: 'text-green-400' },
  { threshold: 0, title: '초보 선원', icon: '⚓', color: 'text-gray-400' }
];

// 선박 데이터
export const SHIPS: Record<string, ShipData> = {
  '카라벨': {
    name: '카라벨',
    icon: '⛵',
    price: 0, // 기본 선박
    maxCargo: 100,
    speed: 1.0,
    durability: 100,
    pirateDefense: 10,
    description: '가벼운 탐험선. 기동성이 좋지만 적재량이 적다.'
  },
  '카락선': {
    name: '카락선',
    icon: '🚢',
    price: 15000,
    maxCargo: 200,
    speed: 1.2, // 20% 느림 (비용 증가)
    durability: 150,
    pirateDefense: 25,
    description: '견고한 대형 상선. 적재량이 많고 내구성이 높다.'
  },
  '갤리온선': {
    name: '갤리온선',
    icon: '🛳️',
    price: 35000,
    maxCargo: 300,
    speed: 1.1, // 10% 느림
    durability: 200,
    pirateDefense: 50,
    description: '무장 상선의 왕. 대포를 탑재해 해적에게 강하다.'
  },
  '정크선': {
    name: '정크선',
    icon: '🚤',
    price: 25000,
    maxCargo: 250,
    speed: 0.9, // 10% 빠름
    durability: 120,
    pirateDefense: 20,
    description: '동양의 범선. 빠르고 효율적인 항해가 가능하다.'
  }
};

// 선박 업그레이드
export const SHIP_UPGRADES: ShipUpgrade[] = [
  {
    id: 'reinforced_hull',
    name: '강화 선체',
    icon: '🛡️',
    price: 5000,
    description: '선체를 강화하여 최대 내구도 +30',
    effect: { type: 'durability', value: 30 }
  },
  {
    id: 'extra_sails',
    name: '추가 돛',
    icon: '🎐',
    price: 8000,
    description: '돛을 추가하여 항해 속도 10% 증가',
    effect: { type: 'speed', value: -0.1 }
  },
  {
    id: 'expanded_hold',
    name: '화물창 확장',
    icon: '📦',
    price: 10000,
    description: '화물창을 확장하여 적재량 +50',
    effect: { type: 'cargo', value: 50 }
  },
  {
    id: 'cannons',
    name: '대포 설치',
    icon: '💣',
    price: 12000,
    description: '대포를 설치하여 해적 방어력 +20%',
    effect: { type: 'pirateDefense', value: 20 }
  },
  {
    id: 'copper_plating',
    name: '구리 도금',
    icon: '🔶',
    price: 15000,
    description: '선체 바닥을 구리로 도금하여 속도 15% 증가, 내구도 +20',
    effect: { type: 'speed', value: -0.15 }
  }
];

// 조선소가 있는 도시
export const SHIPYARD_CITIES = ['리스본', '세비야', '베네치아', '중국'];
