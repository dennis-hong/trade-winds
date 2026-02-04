'use client';

import { useState } from 'react';
import { Ship, Anchor, Shield, Package, Gauge, Zap } from 'lucide-react';
import { SHIPS, SHIP_UPGRADES, SHIPYARD_CITIES } from '../../constants/gameData';
import type { ShipData, ShipUpgrade } from '../../types';

interface ShipyardPanelProps {
  currentCity: string;
  currentShip: string;
  shipUpgrades: string[];
  gold: number;
  onBuyShip: (shipName: string) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  getEffectiveShipStats: () => {
    maxCargo: number;
    speed: number;
    durability: number;
    pirateDefense: number;
  };
}

export function ShipyardPanel({
  currentCity,
  currentShip,
  shipUpgrades,
  gold,
  onBuyShip,
  onBuyUpgrade,
  getEffectiveShipStats
}: ShipyardPanelProps) {
  const [activeTab, setActiveTab] = useState<'ships' | 'upgrades'>('ships');
  
  const hasShipyard = SHIPYARD_CITIES.includes(currentCity);
  const currentShipData = SHIPS[currentShip];
  const effectiveStats = getEffectiveShipStats();

  if (!hasShipyard) {
    return (
      <div className="ocean-card rounded-xl p-4">
        <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
          <Ship className="w-5 h-5 md:w-6 md:h-6" />
          조선소
        </h2>
        <div className="text-center py-6 md:py-8 text-[#8b9dc3]">
          <Ship className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" />
          <p className="text-base md:text-lg">이 도시에는 조선소가 없습니다</p>
          <p className="text-xs md:text-sm mt-2">
            조선소가 있는 도시: {SHIPYARD_CITIES.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ocean-card rounded-xl p-3 md:p-4">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
        <Ship className="w-5 h-5 md:w-6 md:h-6" />
        {currentCity} 조선소
      </h2>

      {/* 현재 선박 정보 */}
      <div className="mb-4 p-3 rounded-lg bg-[#0c1929]/50 border border-[#2d5a87]">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{currentShipData.icon}</span>
          <div>
            <div className="text-lg font-bold text-[#c9a227]">{currentShip}</div>
            <div className="text-xs text-[#8b9dc3]">현재 선박</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-[#d4c49c]">적재량: {effectiveStats.maxCargo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-green-400" />
            <span className="text-[#d4c49c]">속도: {((2 - effectiveStats.speed) * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-[#d4c49c]">내구도: {effectiveStats.durability}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-[#d4c49c]">해적방어: {effectiveStats.pirateDefense}%</span>
          </div>
        </div>
        {shipUpgrades.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#2d5a87]">
            <div className="text-xs text-[#8b9dc3]">
              업그레이드: {shipUpgrades.map(id => {
                const upgrade = SHIP_UPGRADES.find(u => u.id === id);
                return upgrade ? upgrade.icon : '';
              }).join(' ')}
            </div>
          </div>
        )}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-3 md:mb-4">
        <button
          onClick={() => setActiveTab('ships')}
          className={`flex-1 min-h-[44px] py-2 px-3 md:px-4 rounded-lg font-bold text-sm md:text-base transition-all active:scale-95 ${
            activeTab === 'ships'
              ? 'bg-[#c9a227] text-[#0c1929]'
              : 'bg-[#1a3a52] text-[#d4c49c] active:bg-[#2d5a87]'
          }`}
        >
          🚢 선박 구매
        </button>
        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex-1 min-h-[44px] py-2 px-3 md:px-4 rounded-lg font-bold text-sm md:text-base transition-all active:scale-95 ${
            activeTab === 'upgrades'
              ? 'bg-[#c9a227] text-[#0c1929]'
              : 'bg-[#1a3a52] text-[#d4c49c] active:bg-[#2d5a87]'
          }`}
        >
          🔧 업그레이드
        </button>
      </div>

      {/* 선박 목록 */}
      {activeTab === 'ships' && (
        <div className="space-y-3">
          {Object.entries(SHIPS).map(([name, ship]) => {
            const isOwned = name === currentShip;
            const canAfford = gold >= ship.price;
            const isUpgrade = ship.price > 0;
            
            return (
              <div
                key={name}
                className={`p-3 rounded-lg border ${
                  isOwned
                    ? 'border-[#c9a227] bg-[#c9a227]/10'
                    : 'border-[#2d5a87] bg-[#0c1929]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ship.icon}</span>
                    <div>
                      <div className="font-bold text-[#f4e4bc]">
                        {ship.name}
                        {isOwned && (
                          <span className="ml-2 text-xs bg-[#c9a227] text-[#0c1929] px-2 py-0.5 rounded">
                            보유중
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8b9dc3]">{ship.description}</div>
                    </div>
                  </div>
                  {!isOwned && isUpgrade && (
                    <button
                      onClick={() => onBuyShip(name)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-sm font-bold min-h-[40px] min-w-[40px] active:scale-95 transition-transform ${
                        canAfford
                          ? 'bg-[#c9a227] text-[#0c1929] hover:bg-[#e0b82e]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {ship.price.toLocaleString()}G
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-[#8b9dc3]">적재량</div>
                    <div className="text-[#d4c49c] font-bold">{ship.maxCargo}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8b9dc3]">속도</div>
                    <div className="text-[#d4c49c] font-bold">{((2 - ship.speed) * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8b9dc3]">내구도</div>
                    <div className="text-[#d4c49c] font-bold">{ship.durability}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8b9dc3]">해적방어</div>
                    <div className="text-[#d4c49c] font-bold">{ship.pirateDefense}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 업그레이드 목록 */}
      {activeTab === 'upgrades' && (
        <div className="space-y-3">
          {SHIP_UPGRADES.map((upgrade) => {
            const isOwned = shipUpgrades.includes(upgrade.id);
            const canAfford = gold >= upgrade.price;
            
            return (
              <div
                key={upgrade.id}
                className={`p-3 rounded-lg border ${
                  isOwned
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-[#2d5a87] bg-[#0c1929]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{upgrade.icon}</span>
                    <div>
                      <div className="font-bold text-[#f4e4bc]">
                        {upgrade.name}
                        {isOwned && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                            장착됨
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8b9dc3]">{upgrade.description}</div>
                    </div>
                  </div>
                  {!isOwned && (
                    <button
                      onClick={() => onBuyUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded text-sm font-bold min-h-[40px] min-w-[40px] active:scale-95 transition-transform ${
                        canAfford
                          ? 'bg-[#c9a227] text-[#0c1929] hover:bg-[#e0b82e]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {upgrade.price.toLocaleString()}G
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
