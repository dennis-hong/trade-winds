'use client';

import { useState } from 'react';
import { Ship, MapPin, Skull, Anchor, Waves } from 'lucide-react';
import { CITIES, GAME_CONFIG } from '../../constants/gameData';
import { calculateTravelCost, getRiskColor } from '../../utils/game';

// 도시 좌표 (지중해~동아시아 가상 위치, viewBox 기준)
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  '리스본': { x: 80, y: 200 },
  '세비야': { x: 120, y: 230 },
  '베네치아': { x: 200, y: 170 },
  '이스탄불': { x: 290, y: 180 },
  '알렉산드리아': { x: 310, y: 250 },
  '아프리카': { x: 180, y: 350 },
  '인도': { x: 450, y: 280 },
  '중국': { x: 560, y: 220 },
  '일본': { x: 620, y: 180 },
  '신대륙': { x: 30, y: 320 }
};

// 위험도에 따른 항로 색상
const getRouteColor = (risk: number) => {
  if (risk <= 15) return '#22c55e'; // 안전 - 녹색
  if (risk <= 30) return '#eab308'; // 주의 - 노랑
  if (risk <= 50) return '#f97316'; // 위험 - 주황
  return '#ef4444'; // 매우 위험 - 빨강
};

// 위험도에 따른 점선 패턴
const getRouteDashArray = (risk: number) => {
  if (risk <= 15) return 'none';
  if (risk <= 30) return '8,4';
  if (risk <= 50) return '6,6';
  return '4,8';
};

interface WorldMapProps {
  currentCity: string;
  gold: number;
  crew: number;
  onTravel: (destination: string) => void;
}

export function WorldMap({ currentCity, gold, crew, onTravel }: WorldMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  const connectedCities = CITIES[currentCity].connections;
  
  // 모든 항로 생성 (중복 제거)
  const allRoutes: { from: string; to: string; risk: number }[] = [];
  const routeSet = new Set<string>();
  
  Object.entries(CITIES).forEach(([city, data]) => {
    data.connections.forEach(connection => {
      const routeKey = [city, connection].sort().join('-');
      if (!routeSet.has(routeKey)) {
        routeSet.add(routeKey);
        allRoutes.push({
          from: city,
          to: connection,
          risk: data.risk[connection]
        });
      }
    });
  });

  const handleCityClick = (city: string) => {
    if (city === currentCity) return;
    if (connectedCities.includes(city)) {
      onTravel(city);
    }
  };

  const isConnected = (city: string) => connectedCities.includes(city);
  
  const canAffordTravel = (city: string) => {
    if (!isConnected(city)) return false;
    const distance = CITIES[currentCity].distances[city];
    const cost = calculateTravelCost(
      distance,
      crew,
      GAME_CONFIG.TRAVEL_BASE_COST_PER_DISTANCE,
      GAME_CONFIG.TRAVEL_CREW_COST_PER_DISTANCE
    );
    return gold >= cost;
  };

  return (
    <div className="ocean-card rounded-xl p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#c9a227] border-b-2 border-[#2d5a87] pb-2">
        <Anchor className="w-6 h-6" />
        세계 지도
      </h2>
      
      {/* 범례 */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-[#d4c49c]">안전</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-[#d4c49c]">주의</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-[#d4c49c]">위험</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-[#d4c49c]">매우 위험</span>
        </div>
      </div>

      {/* SVG 지도 */}
      <div className="relative bg-[#0a1628] rounded-lg overflow-hidden border border-[#2d5a87]">
        <svg
          viewBox="0 0 700 420"
          className="w-full h-auto"
          style={{ minHeight: '280px' }}
        >
          {/* 배경 그라데이션 - 바다 */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1929" />
              <stop offset="50%" stopColor="#122a42" />
              <stop offset="100%" stopColor="#0a1628" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* 현재 위치 깜빡임 애니메이션 */}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { opacity: 1; r: 12; }
                  50% { opacity: 0.5; r: 18; }
                }
                .current-city-pulse {
                  animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes shipBob {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3px); }
                }
                .ship-icon {
                  animation: shipBob 2s ease-in-out infinite;
                }
              `}
            </style>
          </defs>
          
          <rect width="700" height="420" fill="url(#oceanGradient)" />
          
          {/* 파도 장식 */}
          <g opacity="0.1">
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M ${i * 100} ${350 + (i % 2) * 20} Q ${i * 100 + 50} ${340 + (i % 2) * 20} ${(i + 1) * 100} ${350 + (i % 2) * 20}`}
                stroke="#4a90a4"
                strokeWidth="2"
                fill="none"
              />
            ))}
          </g>

          {/* 대륙 배경 (간략화) */}
          {/* 유럽 */}
          <ellipse cx="150" cy="180" rx="100" ry="80" fill="#1a3a52" opacity="0.3" />
          {/* 아프리카 */}
          <ellipse cx="200" cy="320" rx="80" ry="100" fill="#1a3a52" opacity="0.3" />
          {/* 아시아 */}
          <ellipse cx="500" cy="220" rx="180" ry="120" fill="#1a3a52" opacity="0.3" />
          {/* 신대륙 */}
          <ellipse cx="40" cy="280" rx="50" ry="80" fill="#1a3a52" opacity="0.3" />

          {/* 항로 연결선 */}
          {allRoutes.map(({ from, to, risk }) => {
            const fromPos = CITY_POSITIONS[from];
            const toPos = CITY_POSITIONS[to];
            const isCurrentRoute = 
              (from === currentCity && connectedCities.includes(to)) ||
              (to === currentCity && connectedCities.includes(from));
            const isHovered = selectedRoute === `${from}-${to}` || selectedRoute === `${to}-${from}`;
            
            // 곡선 제어점 계산 (부드러운 항로)
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
            const ctrlX = midX + (dy > 0 ? offset : -offset);
            const ctrlY = midY + (dx > 0 ? -offset : offset);
            
            return (
              <path
                key={`${from}-${to}`}
                d={`M ${fromPos.x} ${fromPos.y} Q ${ctrlX} ${ctrlY} ${toPos.x} ${toPos.y}`}
                stroke={getRouteColor(risk)}
                strokeWidth={isCurrentRoute ? (isHovered ? 4 : 3) : 1.5}
                strokeDasharray={getRouteDashArray(risk)}
                fill="none"
                opacity={isCurrentRoute ? 0.9 : 0.3}
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={() => setSelectedRoute(`${from}-${to}`)}
                onMouseLeave={() => setSelectedRoute(null)}
              />
            );
          })}

          {/* 도시 마커 */}
          {Object.entries(CITY_POSITIONS).map(([city, pos]) => {
            const isCurrent = city === currentCity;
            const connected = isConnected(city);
            const canAfford = canAffordTravel(city);
            const isHovered = hoveredCity === city;
            
            return (
              <g
                key={city}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => handleCityClick(city)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{ cursor: connected && canAfford ? 'pointer' : 'default' }}
              >
                {/* 현재 위치 펄스 */}
                {isCurrent && (
                  <circle
                    r="12"
                    fill="#c9a227"
                    opacity="0.3"
                    className="current-city-pulse"
                  />
                )}
                
                {/* 연결된 도시 하이라이트 */}
                {connected && !isCurrent && (
                  <circle
                    r={isHovered ? 16 : 14}
                    fill={canAfford ? '#22c55e' : '#ef4444'}
                    opacity="0.2"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                )}
                
                {/* 도시 원 */}
                <circle
                  r={isCurrent ? 10 : isHovered ? 9 : 7}
                  fill={isCurrent ? '#c9a227' : connected ? (canAfford ? '#22c55e' : '#6b7280') : '#4a5568'}
                  stroke={isCurrent ? '#f4e4bc' : connected ? '#fff' : '#2d5a87'}
                  strokeWidth={isCurrent ? 3 : 2}
                  filter={isCurrent || isHovered ? 'url(#glow)' : undefined}
                  style={{ transition: 'all 0.3s ease' }}
                />
                
                {/* 현재 위치 배 아이콘 */}
                {isCurrent && (
                  <g className="ship-icon">
                    <text
                      y="-18"
                      textAnchor="middle"
                      fontSize="16"
                      style={{ pointerEvents: 'none' }}
                    >
                      ⛵
                    </text>
                  </g>
                )}
                
                {/* 도시 이름 */}
                <text
                  y={isCurrent ? 28 : 22}
                  textAnchor="middle"
                  fill={isCurrent ? '#c9a227' : connected ? '#f4e4bc' : '#8b9dc3'}
                  fontSize={isCurrent ? 12 : 10}
                  fontWeight={isCurrent || connected ? 'bold' : 'normal'}
                  style={{ pointerEvents: 'none' }}
                >
                  {city}
                </text>
                
                {/* 호버 시 정보 표시 */}
                {isHovered && city !== currentCity && (
                  <g>
                    <rect
                      x="-60"
                      y="-70"
                      width="120"
                      height="45"
                      rx="6"
                      fill="#0c1929"
                      stroke="#2d5a87"
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text x="0" y="-52" textAnchor="middle" fill="#c9a227" fontSize="10" fontWeight="bold">
                      {connected ? (canAfford ? '클릭하여 항해' : '금화 부족') : '항로 없음'}
                    </text>
                    <text x="0" y="-38" textAnchor="middle" fill="#d4c49c" fontSize="9">
                      {connected 
                        ? `${CITIES[currentCity].distances[city]}개월 / 위험 ${CITIES[currentCity].risk[city]}%`
                        : CITIES[city].specialty && `특산품: ${CITIES[city].specialty}`
                      }
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 나침반 장식 */}
          <g transform="translate(640, 60)" opacity="0.6">
            <circle r="25" fill="none" stroke="#c9a227" strokeWidth="2" />
            <text y="5" textAnchor="middle" fill="#c9a227" fontSize="12" fontWeight="bold">N</text>
            <line x1="0" y1="-20" x2="0" y2="-12" stroke="#c9a227" strokeWidth="2" />
            <line x1="0" y1="12" x2="0" y2="20" stroke="#c9a227" strokeWidth="1" />
            <line x1="-20" y1="0" x2="-12" y2="0" stroke="#c9a227" strokeWidth="1" />
            <line x1="12" y1="0" x2="20" y2="0" stroke="#c9a227" strokeWidth="1" />
          </g>
        </svg>
      </div>
      
      {/* 현재 위치 정보 */}
      <div className="mt-3 p-3 rounded-lg bg-[#0c1929]/50 border border-[#2d5a87]">
        <div className="flex items-center gap-2 text-[#c9a227]">
          <MapPin className="w-5 h-5" />
          <span className="font-bold">현재 위치: {currentCity}</span>
        </div>
        <p className="text-sm text-[#d4c49c] mt-1">{CITIES[currentCity].description}</p>
        <div className="text-xs text-[#8b6914] mt-1">
          연결된 항구: {connectedCities.join(', ')}
        </div>
      </div>
    </div>
  );
}
