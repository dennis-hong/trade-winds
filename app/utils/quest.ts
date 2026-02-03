import { CITIES, GOODS } from '../constants/gameData';
import type { Quest, QuestTemplate, QuestCondition, QuestReward } from '../types/quest';

// 퀘스트 템플릿
const QUEST_TEMPLATES: QuestTemplate[] = [
  // 배달 퀘스트
  {
    type: 'delivery',
    name: '{good} 배달 의뢰',
    description: '{good} {amount}개를 {city}까지 배달해주세요.',
    icon: '📦',
    giver: '상인 길드',
    conditionType: 'deliver_goods',
    baseReward: { gold: 2000, reputation: 10 },
    timeLimit: 6,
    difficulty: 'easy'
  },
  {
    type: 'delivery',
    name: '긴급 배달',
    description: '{good} {amount}개를 {city}로 긴급 배달! 빠른 배송 필수!',
    icon: '🚀',
    giver: '귀족',
    conditionType: 'deliver_goods',
    baseReward: { gold: 5000, reputation: 20 },
    timeLimit: 3,
    difficulty: 'medium'
  },
  // 거래 퀘스트
  {
    type: 'trade',
    name: '{good} 무역왕',
    description: '{good}을(를) 총 {amount}개 거래하세요.',
    icon: '💰',
    giver: '무역 조합',
    conditionType: 'trade_amount',
    baseReward: { gold: 3000, reputation: 15 },
    difficulty: 'easy'
  },
  {
    type: 'trade',
    name: '활발한 상인',
    description: '거래를 {amount}회 성사시키세요.',
    icon: '🤝',
    giver: '상인 길드',
    conditionType: 'trade_count',
    baseReward: { gold: 1500, reputation: 10 },
    difficulty: 'easy'
  },
  // 탐험 퀘스트
  {
    type: 'explore',
    name: '{city} 탐험',
    description: '{city}을(를) 방문하세요. 새로운 항로 개척!',
    icon: '🗺️',
    giver: '탐험가 협회',
    conditionType: 'visit_city',
    baseReward: { gold: 4000, reputation: 25 },
    difficulty: 'medium'
  },
  // 부 축적 퀘스트
  {
    type: 'wealth',
    name: '부자가 되자',
    description: '총 자산 {amount} 두카트를 달성하세요.',
    icon: '👑',
    giver: '은행가',
    conditionType: 'accumulate_gold',
    baseReward: { gold: 5000, reputation: 30 },
    difficulty: 'hard'
  }
];

// 랜덤 요소 선택
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 난이도에 따른 수량 결정
function getAmountByDifficulty(difficulty: 'easy' | 'medium' | 'hard', conditionType: string): number {
  const amounts: Record<string, Record<string, number>> = {
    deliver_goods: { easy: 10, medium: 25, hard: 50 },
    trade_amount: { easy: 30, medium: 60, hard: 100 },
    trade_count: { easy: 10, medium: 25, hard: 50 },
    accumulate_gold: { easy: 20000, medium: 50000, hard: 100000 },
    visit_city: { easy: 1, medium: 1, hard: 1 }
  };
  return amounts[conditionType]?.[difficulty] ?? 10;
}

// 보상 배율
function getRewardMultiplier(difficulty: 'easy' | 'medium' | 'hard'): number {
  return { easy: 1, medium: 1.5, hard: 2.5 }[difficulty];
}

// 퀘스트 ID 생성
function generateQuestId(): string {
  return `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 단일 퀘스트 생성
export function generateQuest(
  year: number,
  month: number,
  currentCity: string,
  excludeIds: string[] = []
): Quest {
  const template = randomChoice(QUEST_TEMPLATES);
  const cityNames = Object.keys(CITIES);
  const goodNames = Object.keys(GOODS);
  
  // 목적지 도시 (현재 도시 제외)
  const targetCity = randomChoice(cityNames.filter(c => c !== currentCity));
  const targetGood = randomChoice(goodNames);
  const amount = getAmountByDifficulty(template.difficulty, template.conditionType);
  const rewardMultiplier = getRewardMultiplier(template.difficulty);
  
  // 조건 생성
  const condition: QuestCondition = {
    type: template.conditionType,
    current: 0
  };
  
  if (template.conditionType === 'deliver_goods') {
    condition.good = targetGood;
    condition.city = targetCity;
    condition.amount = amount;
  } else if (template.conditionType === 'trade_amount') {
    condition.good = targetGood;
    condition.amount = amount;
  } else if (template.conditionType === 'visit_city') {
    condition.city = targetCity;
    condition.amount = 1;
  } else if (template.conditionType === 'accumulate_gold') {
    condition.amount = amount;
  } else if (template.conditionType === 'trade_count') {
    condition.amount = amount;
  }
  
  // 보상 계산
  const reward: QuestReward = {
    gold: Math.round((template.baseReward.gold ?? 0) * rewardMultiplier),
    reputation: Math.round((template.baseReward.reputation ?? 0) * rewardMultiplier)
  };
  
  // 이름/설명 템플릿 치환
  const name = template.name
    .replace('{good}', GOODS[targetGood]?.icon + ' ' + targetGood || targetGood)
    .replace('{city}', targetCity)
    .replace('{amount}', amount.toString());
  
  const description = template.description
    .replace('{good}', targetGood)
    .replace('{city}', targetCity)
    .replace('{amount}', amount.toLocaleString());
  
  // 만료 시간 계산
  let expiresAt: { year: number; month: number } | undefined;
  if (template.timeLimit) {
    let expMonth = month + template.timeLimit;
    let expYear = year;
    while (expMonth > 12) {
      expMonth -= 12;
      expYear += 1;
    }
    expiresAt = { year: expYear, month: expMonth };
  }
  
  return {
    id: generateQuestId(),
    name,
    description,
    type: template.type,
    icon: template.icon,
    giver: template.giver,
    giverCity: currentCity,
    condition,
    reward,
    timeLimit: template.timeLimit,
    expiresAt,
    status: 'active',
    startedAt: { year, month }
  };
}

// 초기 퀘스트 생성 (게임 시작 시)
export function generateInitialQuests(year: number, month: number, currentCity: string): Quest[] {
  const quests: Quest[] = [];
  const usedIds: string[] = [];
  
  // 3개의 퀘스트 생성 (다양한 타입)
  for (let i = 0; i < 3; i++) {
    const quest = generateQuest(year, month, currentCity, usedIds);
    quests.push(quest);
    usedIds.push(quest.id);
  }
  
  return quests;
}

// 퀘스트 진행상황 업데이트
export function updateQuestProgress(
  quests: Quest[],
  action: {
    type: 'buy' | 'sell' | 'travel' | 'assets';
    good?: string;
    quantity?: number;
    city?: string;
    totalAssets?: number;
  }
): Quest[] {
  return quests.map(quest => {
    if (quest.status !== 'active') return quest;
    
    const { condition } = quest;
    let updated = { ...quest };
    let newCurrent = condition.current || 0;
    
    switch (condition.type) {
      case 'deliver_goods':
        // 배달 퀘스트: 목적지에서 해당 상품 판매
        if (action.type === 'sell' && 
            action.good === condition.good && 
            action.city === condition.city) {
          newCurrent += action.quantity || 0;
        }
        break;
        
      case 'trade_amount':
        // 거래량 퀘스트: 특정 상품 구매+판매
        if ((action.type === 'buy' || action.type === 'sell') && 
            action.good === condition.good) {
          newCurrent += action.quantity || 0;
        }
        break;
        
      case 'trade_count':
        // 거래 횟수 퀘스트
        if (action.type === 'buy' || action.type === 'sell') {
          newCurrent += 1;
        }
        break;
        
      case 'visit_city':
        // 탐험 퀘스트: 목적지 방문
        if (action.type === 'travel' && action.city === condition.city) {
          newCurrent = 1;
        }
        break;
        
      case 'accumulate_gold':
        // 부 축적 퀘스트
        if (action.type === 'assets' && action.totalAssets) {
          newCurrent = action.totalAssets;
        }
        break;
    }
    
    updated.condition = { ...condition, current: newCurrent };
    
    // 완료 체크
    if (newCurrent >= (condition.amount || 0)) {
      updated.status = 'completed';
    }
    
    return updated;
  });
}

// 만료된 퀘스트 체크
export function checkExpiredQuests(
  quests: Quest[],
  year: number,
  month: number
): Quest[] {
  return quests.map(quest => {
    if (quest.status !== 'active' || !quest.expiresAt) return quest;
    
    const isExpired = 
      year > quest.expiresAt.year || 
      (year === quest.expiresAt.year && month > quest.expiresAt.month);
    
    if (isExpired) {
      return { ...quest, status: 'failed' };
    }
    
    return quest;
  });
}

// 완료된 퀘스트 보상 계산
export function getCompletedRewards(quests: Quest[]): QuestReward {
  return quests
    .filter(q => q.status === 'completed')
    .reduce(
      (acc, quest) => ({
        gold: (acc.gold || 0) + (quest.reward.gold || 0),
        reputation: (acc.reputation || 0) + (quest.reward.reputation || 0)
      }),
      { gold: 0, reputation: 0 }
    );
}
