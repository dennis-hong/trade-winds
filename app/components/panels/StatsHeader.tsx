import {
  Coins,
  MapPin,
  ScrollText,
  Package,
  Heart,
  Users
} from 'lucide-react';
import { StatusCard, ProgressBar } from '../ui';
import { CITIES } from '../../constants/gameData';
import type { TitleInfo } from '../../types';

interface StatsHeaderProps {
  gold: number;
  currentCity: string;
  year: number;
  month: number;
  totalCargo: number;
  shipCondition: number;
  crew: number;
  titleInfo: TitleInfo;
  totalAssets: number;
  tradeCount: number;
  highestAssets: number;
  showRecordBadge: boolean;
  animateTradeCount: boolean;
}

export function StatsHeader({
  gold,
  currentCity,
  year,
  month,
  totalCargo,
  shipCondition,
  crew,
  titleInfo,
  totalAssets,
  tradeCount,
  highestAssets,
  showRecordBadge,
  animateTradeCount
}: StatsHeaderProps) {
  return (
    <>
      {/* Title & Stats Bar */}
      <div className="status-bar rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{titleInfo.icon}</span>
            <div>
              <div className={`font-bold text-lg ${titleInfo.color}`}>{titleInfo.title}</div>
              <div className="text-xs text-[#d4c49c]">총 자산: {totalAssets.toLocaleString()} 두카트</div>
            </div>
          </div>
          {/* Trade Count */}
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <div
                className={`font-bold text-[#c9a227] transition-transform duration-300 ${
                  animateTradeCount ? 'scale-125' : 'scale-100'
                }`}
              >
                {tradeCount}회
              </div>
              <div className="text-xs text-[#d4c49c]">총 거래</div>
            </div>
          </div>
          {/* Highest Assets */}
          <div className="flex items-center gap-2 relative">
            <span
              className={`text-xl transition-all duration-300 ${
                showRecordBadge ? 'animate-record-shine scale-125' : ''
              }`}
            >
              🏅
            </span>
            <div>
              <div
                className={`font-bold text-amber-400 transition-all duration-300 ${
                  showRecordBadge ? 'scale-110 text-yellow-300' : ''
                }`}
              >
                {highestAssets.toLocaleString()}
              </div>
              <div className="text-xs text-[#d4c49c]">최고 자산</div>
            </div>
            {showRecordBadge && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-[#3d2314] text-xs font-bold px-2 py-0.5 rounded-full animate-fade-in-out">
                새 기록!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatusCard
            icon={Coins}
            label="보유 금화"
            value={`${gold.toLocaleString()} 두카트`}
            iconColor="text-yellow-400"
          />
          <StatusCard
            icon={MapPin}
            label="현재 위치"
            value={currentCity}
            subValue={CITIES[currentCity].description}
          />
          <StatusCard
            icon={ScrollText}
            label="날짜"
            value={`${year}년 ${month}월`}
          />
          <StatusCard
            icon={Package}
            label="화물"
            value={`${totalCargo} / 100`}
          />
          <div className="parchment rounded-lg p-3 text-[#3d2314]">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-xs opacity-70">선박 상태</span>
            </div>
            <ProgressBar value={shipCondition} max={100} />
            <div className="text-right text-xs mt-1 font-bold">{shipCondition}%</div>
          </div>
          <div className="parchment rounded-lg p-3 text-[#3d2314]">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs opacity-70">선원</span>
            </div>
            <ProgressBar value={crew} max={100} />
            <div className="text-right text-xs mt-1 font-bold">{crew}명</div>
          </div>
        </div>
      </div>
    </>
  );
}
