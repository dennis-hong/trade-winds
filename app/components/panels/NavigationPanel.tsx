import { Wind, MapPin, Sparkles, Ship, Waves, Skull, TrendingUp, AlertCircle } from 'lucide-react';
import { CITIES, GOODS, GAME_CONFIG } from '../../constants/gameData';
import { getRiskColor, getRiskBgClass, calculateTravelCost } from '../../utils/game';
import { calculateBestTrade } from '../../utils/trade';

interface NavigationPanelProps {
  currentCity: string;
  crew: number;
  gold: number;
  inventory: Record<string, number>;
  averagePrices: Record<string, number>;
  prices: Record<string, Record<string, number>>;
  onTravel: (destination: string) => void;
}

export function NavigationPanel({
  currentCity,
  crew,
  gold,
  inventory,
  averagePrices,
  prices,
  onTravel
}: NavigationPanelProps) {
  return (
    <div className="ocean-card rounded-xl p-3 md:p-4">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
        <Wind className="w-5 h-5 md:w-6 md:h-6" />
        항해
      </h2>

      <div className="mb-3 md:mb-4 p-2.5 md:p-3 rounded-lg bg-[#0c1929]/50 border border-[#2d5a87]">
        <div className="flex items-center gap-2 text-[#c9a227]">
          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-bold text-sm md:text-base">{currentCity}</span>
        </div>
        <p className="text-xs md:text-sm text-[#d4c49c] mt-0.5 md:mt-1">{CITIES[currentCity].description}</p>
        <p className="text-[10px] md:text-xs text-[#8b6914] mt-0.5 md:mt-1">
          <Sparkles className="inline w-3 h-3 mr-1" />
          특산품: {CITIES[currentCity].specialty}
        </p>
      </div>

      <div className="space-y-2 md:space-y-3">
        {CITIES[currentCity].connections.map(city => {
          const distance = CITIES[currentCity].distances[city];
          const risk = CITIES[currentCity].risk[city];
          const totalCost = calculateTravelCost(
            distance,
            crew,
            GAME_CONFIG.TRAVEL_BASE_COST_PER_DISTANCE,
            GAME_CONFIG.TRAVEL_CREW_COST_PER_DISTANCE
          );
          const { bestGood, bestProfit } = calculateBestTrade(
            city,
            currentCity,
            inventory,
            averagePrices,
            prices
          );
          const canAfford = gold >= totalCost;

          return (
            <button
              key={city}
              onClick={() => onTravel(city)}
              disabled={!canAfford}
              className={`w-full p-3 md:p-4 rounded-lg border-2 transition-all min-h-[64px] ${
                canAfford
                  ? `active:scale-[0.98] ${getRiskBgClass(risk)}`
                  : 'opacity-60 cursor-not-allowed bg-[#1a3a52]/50 border-[#2d5a87]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Ship className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${canAfford ? 'text-[#c9a227]' : 'text-gray-500'}`} />
                  <div className="text-left min-w-0">
                    <div className={`font-bold text-base md:text-lg ${canAfford ? 'text-[#f4e4bc]' : 'text-gray-400'}`}>{city}</div>
                    <div className={`text-xs md:text-sm ${canAfford ? 'text-[#d4c49c]' : 'text-gray-500'} truncate`}>{CITIES[city].description}</div>
                    {!canAfford && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] md:text-xs text-red-400 font-semibold">금화 부족</span>
                      </div>
                    )}
                    {canAfford && bestGood && bestProfit > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] md:text-xs text-emerald-400">
                          {GOODS[bestGood]?.icon} {bestGood} +{bestProfit.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`flex items-center gap-1 text-sm ${canAfford ? 'text-[#c9a227]' : 'text-gray-500'}`}>
                    <Waves className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">{distance}개월</span>
                  </div>
                  <div className={`text-xs md:text-sm ${canAfford ? 'text-[#d4c49c]' : 'text-red-400 font-semibold'}`}>
                    {totalCost.toLocaleString()}G
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${canAfford ? getRiskColor(risk) : 'text-gray-500'}`}>
                    <Skull className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[10px] md:text-sm">{risk}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
