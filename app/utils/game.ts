import { TITLES, RUMOR_TEMPLATES, CITIES, GOODS } from '../constants/gameData';
import type { TitleInfo, Rumor } from '../types';

/**
 * 자산에 따른 칭호 정보 반환
 */
export function getTitleInfo(totalAssets: number): TitleInfo {
  for (const title of TITLES) {
    if (totalAssets >= title.threshold) {
      return { title: title.title, icon: title.icon, color: title.color };
    }
  }
  return TITLES[TITLES.length - 1];
}

/**
 * 칭호 순위 목록
 */
export const TITLE_RANKS = ['초보 선원', '견습 상인', '무역왕', '해상 제국'];

/**
 * 총 자산 계산
 */
export function calculateTotalAssets(
  gold: number,
  inventory: Record<string, number>,
  averagePrices: Record<string, number>
): number {
  let inventoryValue = 0;
  Object.entries(inventory).forEach(([good, amount]) => {
    const avgPrice = averagePrices[good] || 0;
    inventoryValue += avgPrice * amount;
  });
  return gold + inventoryValue;
}

/**
 * 소문 생성
 */
export function generateRumors(): Rumor[] {
  const cityKeys = Object.keys(CITIES);
  const goodKeys = Object.keys(GOODS);
  const newRumors: Rumor[] = [];

  for (let i = 0; i < 3; i++) {
    const template = RUMOR_TEMPLATES[Math.floor(Math.random() * RUMOR_TEMPLATES.length)];
    const city = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    const good = goodKeys[Math.floor(Math.random() * goodKeys.length)];

    newRumors.push({
      text: template.text.replace('{city}', city).replace('{good}', good),
      city,
      good,
      type: template.type,
      effect: template.effect,
      reliability: Math.random() > 0.5
    });
  }

  return newRumors;
}

/**
 * 위험도에 따른 텍스트 색상 클래스 반환
 */
export function getRiskColor(risk: number): string {
  if (risk >= 50) return 'text-red-400';
  if (risk >= 30) return 'text-yellow-400';
  return 'text-green-400';
}

/**
 * 위험도에 따른 배경 클래스 반환
 */
export function getRiskBgClass(risk: number): string {
  if (risk >= 50) return 'bg-red-900/30 border-red-700';
  if (risk >= 30) return 'bg-yellow-900/30 border-yellow-700';
  return 'bg-green-900/30 border-green-700';
}

/**
 * 여행 비용 계산
 */
export function calculateTravelCost(
  distance: number,
  crew: number,
  baseCostPerDistance: number,
  crewCostPerDistance: number
): number {
  return distance * baseCostPerDistance + crew * distance * crewCostPerDistance;
}

/**
 * 로그 메시지 포맷
 */
export function formatLogMessage(year: number, month: number, message: string): string {
  return `[${year}년 ${month}월] ${message}`;
}
