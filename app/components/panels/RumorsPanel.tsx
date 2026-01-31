import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import type { Rumor, TradeRecommendation } from '../../types';

interface RumorsPanelProps {
  rumors: Rumor[];
  recommendations: TradeRecommendation[];
}

export function RumorsPanel({ rumors, recommendations }: RumorsPanelProps) {
  return (
    <div className="ocean-card rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
