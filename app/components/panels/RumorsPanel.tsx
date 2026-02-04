'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { Rumor, TradeRecommendation } from '../../types';

interface RumorsPanelProps {
  rumors: Rumor[];
  recommendations: TradeRecommendation[];
}

export function RumorsPanel({ rumors, recommendations }: RumorsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ocean-card rounded-xl p-3 md:p-4 mb-3 md:mb-6">
      {/* Mobile: collapsible summary */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between min-h-[40px]"
        >
          <div className="flex items-center gap-3 text-xs">
            {recommendations.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                추천 {recommendations.length}개
              </span>
            )}
            <span className="flex items-center gap-1 text-[#c9a227]">
              <AlertTriangle className="w-3.5 h-3.5" />
              소문 {rumors.length}개
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#d4c49c]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#d4c49c]" />
          )}
        </button>

        {/* Top recommendation always visible */}
        {!isExpanded && recommendations.length > 0 && (
          <div className="mt-1.5 p-2 rounded-lg border bg-emerald-900/30 border-emerald-600">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[#f4e4bc] font-medium flex-1 min-w-0 truncate">{recommendations[0].text}</p>
              <span className="text-xs text-yellow-400 font-bold shrink-0 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" />
                {recommendations[0].profit}%
              </span>
            </div>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-2 space-y-3">
            {/* Recommendations */}
            <div>
              <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2 text-[#c9a227]">
                <TrendingUp className="w-4 h-4" />
                무역 추천
              </h3>
              <div className="space-y-1.5">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, i) => (
                    <div key={i} className="p-2 rounded-lg border bg-emerald-900/30 border-emerald-600">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-[#f4e4bc] font-medium flex-1 min-w-0">{rec.text}</p>
                        <span className="text-xs text-yellow-400 font-bold shrink-0 flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" />
                          {rec.profit}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 rounded-lg border bg-gray-900/30 border-gray-600">
                    <p className="text-xs text-[#d4c49c]">특별한 무역 기회 없음</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rumors */}
            <div>
              <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2 text-[#c9a227]">
                <AlertTriangle className="w-4 h-4" />
                항구의 소문
              </h3>
              <div className="space-y-1.5">
                {rumors.map((rumor, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${
                      rumor.reliability
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-red-900/20 border-red-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#f4e4bc] flex-1 min-w-0">{rumor.text}</p>
                      <span className={`text-[10px] shrink-0 ${
                        rumor.reliability ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {rumor.reliability ? '✓ 신뢰' : '? 미확인'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: full layout */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trading Recommendations */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#c9a227]">
            <TrendingUp className="w-5 h-5" />
            무역 추천
          </h3>
          <div className="space-y-2">
            {recommendations.length > 0 ? (
              recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border bg-emerald-900/30 border-emerald-600"
                >
                  <p className="text-sm text-[#f4e4bc] font-medium">{rec.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">수익률 {rec.profit}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg border bg-gray-900/30 border-gray-600">
                <p className="text-sm text-[#d4c49c]">이 항구에서는 특별한 무역 기회가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Port Rumors */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#c9a227]">
            <AlertTriangle className="w-5 h-5" />
            항구의 소문
          </h3>
          <div className="space-y-2">
            {rumors.map((rumor, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  rumor.reliability
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-red-900/20 border-red-700'
                }`}
              >
                <p className="text-sm text-[#f4e4bc]">{rumor.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {rumor.reliability ? '신뢰할 만한 정보' : '확인되지 않은 소문'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
