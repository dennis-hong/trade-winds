// 퀘스트 타입
export type QuestType = 'delivery' | 'trade' | 'explore' | 'wealth';

// 퀘스트 상태
export type QuestStatus = 'active' | 'completed' | 'failed' | 'expired';

// 퀘스트 조건 타입
export interface QuestCondition {
  type: 'deliver_goods' | 'trade_amount' | 'visit_city' | 'accumulate_gold' | 'trade_count';
  good?: string;        // 특정 상품 (delivery, trade_amount)
  city?: string;        // 목적지 도시 (delivery, visit_city)
  amount?: number;      // 필요 수량/금액
  current?: number;     // 현재 진행 상황
}

// 퀘스트 보상 타입
export interface QuestReward {
  gold?: number;
  reputation?: number;
  title?: string;
  shipUpgrade?: string;
}

// 퀘스트 데이터
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  icon: string;
  giver: string;        // 의뢰인
  giverCity: string;    // 의뢰 도시
  condition: QuestCondition;
  reward: QuestReward;
  timeLimit?: number;   // 제한 시간 (개월)
  expiresAt?: { year: number; month: number };
  status: QuestStatus;
  startedAt: { year: number; month: number };
}

// 퀘스트 템플릿 (생성용)
export interface QuestTemplate {
  type: QuestType;
  name: string;
  description: string;
  icon: string;
  giver: string;
  conditionType: QuestCondition['type'];
  baseReward: QuestReward;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
