'use client';

import { useState } from 'react';
import { Scroll, CheckCircle, XCircle, Clock, Gift, Star, RefreshCw } from 'lucide-react';
import type { Quest } from '../../types/quest';

interface QuestPanelProps {
  quests: Quest[];
  year: number;
  month: number;
  onClaimReward: (questId: string) => void;
  onAbandonQuest: (questId: string) => void;
  onRefreshQuests: () => void;
  reputation: number;
}

export function QuestPanel({
  quests,
  year,
  month,
  onClaimReward,
  onAbandonQuest,
  onRefreshQuests,
  reputation
}: QuestPanelProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');
  const failedQuests = quests.filter(q => q.status === 'failed');
  
  // 남은 시간 계산
  const getRemainingTime = (quest: Quest): string | null => {
    if (!quest.expiresAt) return null;
    
    let remainingMonths = (quest.expiresAt.year - year) * 12 + (quest.expiresAt.month - month);
    if (remainingMonths <= 0) return '만료됨';
    if (remainingMonths === 1) return '1개월 남음';
    return `${remainingMonths}개월 남음`;
  };
  
  // 진행률 계산
  const getProgress = (quest: Quest): number => {
    const { current = 0, amount = 1 } = quest.condition;
    return Math.min(100, Math.round((current / amount) * 100));
  };

  return (
    <div className="ocean-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
          <Scroll className="w-6 h-6" />
          의뢰 현황
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-[#d4c49c]">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>명성: {reputation}</span>
          </div>
          <button
            onClick={onRefreshQuests}
            className="p-2 rounded-lg bg-[#1a3a52] hover:bg-[#2d5a87] text-[#c9a227] transition-colors"
            title="새 의뢰 확인"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'active'
              ? 'bg-[#c9a227] text-[#0c1929]'
              : 'bg-[#1a3a52] text-[#d4c49c] hover:bg-[#2d5a87]'
          }`}
        >
          📋 진행 중 ({activeQuests.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-[#c9a227] text-[#0c1929]'
              : 'bg-[#1a3a52] text-[#d4c49c] hover:bg-[#2d5a87]'
          }`}
        >
          ✅ 완료 ({completedQuests.length})
        </button>
      </div>

      {/* 퀘스트 목록 */}
      <div className="space-y-3">
        {activeTab === 'active' && (
          <>
            {activeQuests.length === 0 ? (
              <div className="text-center py-8 text-[#8b9dc3]">
                <Scroll className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>진행 중인 의뢰가 없습니다</p>
                <p className="text-sm mt-1">새 의뢰 버튼을 눌러 의뢰를 받아보세요!</p>
              </div>
            ) : (
              activeQuests.map(quest => {
                const progress = getProgress(quest);
                const remaining = getRemainingTime(quest);
                const isUrgent = remaining && remaining.includes('1개월');
                
                return (
                  <div
                    key={quest.id}
                    className={`p-3 rounded-lg border ${
                      isUrgent
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-[#2d5a87] bg-[#0c1929]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{quest.icon}</span>
                        <div>
                          <div className="font-bold text-[#f4e4bc]">{quest.name}</div>
                          <div className="text-xs text-[#8b9dc3]">
                            의뢰인: {quest.giver} ({quest.giverCity})
                          </div>
                        </div>
                      </div>
                      {remaining && (
                        <div className={`flex items-center gap-1 text-xs ${
                          isUrgent ? 'text-red-400' : 'text-[#8b9dc3]'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {remaining}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-[#d4c49c] mb-2">{quest.description}</p>
                    
                    {/* 진행 바 */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-[#8b9dc3] mb-1">
                        <span>진행률</span>
                        <span>{quest.condition.current || 0} / {quest.condition.amount}</span>
                      </div>
                      <div className="h-2 bg-[#1a3a52] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            progress >= 100 ? 'bg-green-500' : 'bg-[#c9a227]'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* 보상 & 액션 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        {quest.reward.gold && (
                          <span className="text-yellow-400">💰 {quest.reward.gold.toLocaleString()}G</span>
                        )}
                        {quest.reward.reputation && (
                          <span className="text-blue-400">⭐ +{quest.reward.reputation}</span>
                        )}
                      </div>
                      <button
                        onClick={() => onAbandonQuest(quest.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        포기
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedQuests.length === 0 && failedQuests.length === 0 ? (
              <div className="text-center py-8 text-[#8b9dc3]">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>완료된 의뢰가 없습니다</p>
              </div>
            ) : (
              <>
                {/* 완료된 퀘스트 */}
                {completedQuests.map(quest => (
                  <div
                    key={quest.id}
                    className="p-3 rounded-lg border border-green-500/50 bg-green-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{quest.icon}</span>
                        <div>
                          <div className="font-bold text-green-400 flex items-center gap-2">
                            {quest.name}
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="text-xs text-[#8b9dc3]">{quest.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onClaimReward(quest.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-green-500 text-white font-bold text-sm hover:bg-green-400"
                      >
                        <Gift className="w-4 h-4" />
                        보상 받기
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      {quest.reward.gold && (
                        <span className="text-yellow-400">💰 {quest.reward.gold.toLocaleString()}G</span>
                      )}
                      {quest.reward.reputation && (
                        <span className="text-blue-400">⭐ +{quest.reward.reputation}</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* 실패한 퀘스트 */}
                {failedQuests.map(quest => (
                  <div
                    key={quest.id}
                    className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 opacity-60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl grayscale">{quest.icon}</span>
                      <div>
                        <div className="font-bold text-red-400 flex items-center gap-2">
                          {quest.name}
                          <XCircle className="w-4 h-4" />
                        </div>
                        <div className="text-xs text-[#8b9dc3]">기한 만료</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
