'use client';

import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG, CITIES, GOODS } from '../constants/gameData';
import {
  calculateInitialPrices,
  updatePricesWithRumors,
  calculateMaxBuyQuantity
} from '../utils/price';
import { calculateNewAveragePrice } from '../utils/trade';
import {
  generateRumors,
  calculateTotalAssets,
  getTitleInfo,
  TITLE_RANKS,
  formatLogMessage,
  calculateTravelCost
} from '../utils/game';
import {
  initializeStocks,
  refillStocks,
  reduceStock,
  getMaxStock,
  type CityStocks
} from '../utils/stock';
import type { Rumor, GameEvent } from '../types';

export function useGameState() {
  // 기본 게임 상태
  const [gold, setGold] = useState(GAME_CONFIG.INITIAL_GOLD);
  const [currentCity, setCurrentCity] = useState('리스본');
  const [year, setYear] = useState(GAME_CONFIG.INITIAL_YEAR);
  const [month, setMonth] = useState(GAME_CONFIG.INITIAL_MONTH);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [averagePrices, setAveragePrices] = useState<Record<string, number>>({});
  const [shipCondition, setShipCondition] = useState(GAME_CONFIG.INITIAL_SHIP_CONDITION);
  const [crew, setCrew] = useState(GAME_CONFIG.INITIAL_CREW);
  const [prices, setPrices] = useState(() => calculateInitialPrices(false));
  const [logs, setLogs] = useState<string[]>(['대항해의 시대가 시작되었습니다!']);
  const [rumors, setRumors] = useState<Rumor[]>([]);
  const [cityStocks, setCityStocks] = useState<CityStocks>({});

  // 통계 추적
  const [tradeCount, setTradeCount] = useState(0);
  const [highestAssets, setHighestAssets] = useState(GAME_CONFIG.INITIAL_GOLD);

  // UI 상태
  const [isClient, setIsClient] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // 칭호 관련
  const [previousTitle, setPreviousTitle] = useState('초보 선원');
  const [showTitleCelebration, setShowTitleCelebration] = useState(false);
  const [newTitleInfo, setNewTitleInfo] = useState<{ title: string; icon: string } | null>(null);
  const [showRecordBadge, setShowRecordBadge] = useState(false);
  const [animateTradeCount, setAnimateTradeCount] = useState(false);

  // 클라이언트 초기화 (hydration 불일치 방지)
  useEffect(() => {
    setIsClient(true);
    setPrices(calculateInitialPrices(true));
    setCityStocks(initializeStocks());
  }, []);

  // 총 자산 계산
  const totalAssets = calculateTotalAssets(gold, inventory, averagePrices);
  const titleInfo = getTitleInfo(totalAssets);
  const totalCargo = Object.values(inventory).reduce((a, b) => a + b, 0);

  // 최고 자산 기록 업데이트
  useEffect(() => {
    if (totalAssets > highestAssets) {
      setHighestAssets(totalAssets);
      setShowRecordBadge(true);
      setTimeout(() => setShowRecordBadge(false), 2000);
    }
  }, [totalAssets, highestAssets]);

  // 칭호 승급 확인
  useEffect(() => {
    const currentTitle = titleInfo.title;
    if (currentTitle !== previousTitle && previousTitle !== '') {
      const prevRank = TITLE_RANKS.indexOf(previousTitle);
      const currRank = TITLE_RANKS.indexOf(currentTitle);

      if (currRank > prevRank) {
        setNewTitleInfo({ title: currentTitle, icon: titleInfo.icon });
        setShowTitleCelebration(true);
        setTimeout(() => setShowTitleCelebration(false), 3500);
      }
    }
    setPreviousTitle(currentTitle);
  }, [titleInfo.title, titleInfo.icon, previousTitle]);

  // 소문 초기화
  useEffect(() => {
    if (isClient) {
      setRumors(generateRumors());
    }
  }, [currentCity, isClient]);

  // 로그 추가
  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-9), formatLogMessage(year, month, message)]);
  }, [year, month]);

  // 이벤트 표시
  const showEvent = useCallback((title: string, message: string, type: GameEvent['type']) => {
    setCurrentEvent({ title, message, type });
    setIsEventModalOpen(true);
    setTimeout(() => setIsEventModalOpen(false), 3000);
  }, []);

  // 가격 업데이트
  const updatePrices = useCallback(() => {
    setPrices(prev => updatePricesWithRumors(prev, rumors));
    setRumors(generateRumors());
  }, [rumors]);

  // 상품 구매
  const buyGood = useCallback((good: string, quantity: number) => {
    const price = prices[currentCity][good];
    const totalCost = price * quantity;

    // 재고 체크
    const availableStock = cityStocks[currentCity]?.[good] ?? 0;
    if (availableStock < quantity) {
      showEvent('거래 실패', `재고가 부족합니다! (남은 재고: ${availableStock}개)`, 'danger');
      return false;
    }

    if (gold < totalCost) {
      showEvent('거래 실패', '두카트가 부족합니다!', 'danger');
      return false;
    }

    const currentAmount = inventory[good] || 0;
    if (totalCargo + quantity > GAME_CONFIG.MAX_CARGO) {
      showEvent('거래 실패', '선창 용량이 부족합니다!', 'danger');
      return false;
    }

    const currentAvg = averagePrices[good] || 0;
    const newAvg = calculateNewAveragePrice(currentAmount, currentAvg, quantity, price);

    setGold(prev => prev - totalCost);
    setInventory(prev => ({ ...prev, [good]: (prev[good] || 0) + quantity }));
    setAveragePrices(prev => ({ ...prev, [good]: newAvg }));
    setCityStocks(prev => reduceStock(prev, currentCity, good, quantity));
    setTradeCount(prev => prev + 1);
    setAnimateTradeCount(true);
    setTimeout(() => setAnimateTradeCount(false), 300);
    addLog(`${GOODS[good].icon} ${good} ${quantity}개를 ${totalCost.toLocaleString()} 두카트에 구매`);

    return true;
  }, [gold, currentCity, prices, inventory, averagePrices, totalCargo, cityStocks, showEvent, addLog]);

  // 상품 판매
  const sellGood = useCallback((good: string, quantity: number) => {
    const amount = inventory[good] || 0;

    if (amount < quantity) {
      showEvent('거래 실패', '보유한 상품이 부족합니다!', 'danger');
      return false;
    }

    const price = prices[currentCity][good];
    const totalPrice = price * quantity;
    const avgPrice = averagePrices[good] || 0;
    const profit = (price - avgPrice) * quantity;

    setGold(prev => prev + totalPrice);
    const newAmount = amount - quantity;
    if (newAmount === 0) {
      setInventory(prev => {
        const next = { ...prev };
        delete next[good];
        return next;
      });
      setAveragePrices(prev => {
        const next = { ...prev };
        delete next[good];
        return next;
      });
    } else {
      setInventory(prev => ({ ...prev, [good]: newAmount }));
    }

    const profitText = profit > 0 ? `+${profit.toLocaleString()}` : profit.toLocaleString();
    setTradeCount(prev => prev + 1);
    setAnimateTradeCount(true);
    setTimeout(() => setAnimateTradeCount(false), 300);
    addLog(`${GOODS[good].icon} ${good} ${quantity}개 판매 (이익: ${profitText})`);

    if (profit > 0) {
      showEvent('거래 성공', `${profit.toLocaleString()} 두카트의 이익!`, 'success');
    }

    return true;
  }, [inventory, prices, currentCity, averagePrices, showEvent, addLog]);

  // 여행
  const travel = useCallback((destination: string) => {
    const distance = CITIES[currentCity].distances[destination];
    const riskLevel = CITIES[currentCity].risk[destination];
    const totalCost = calculateTravelCost(
      distance,
      crew,
      GAME_CONFIG.TRAVEL_BASE_COST_PER_DISTANCE,
      GAME_CONFIG.TRAVEL_CREW_COST_PER_DISTANCE
    );

    if (gold < totalCost) {
      showEvent('항해 불가', `여행 비용이 부족합니다! (필요: ${totalCost.toLocaleString()} 두카트)`, 'danger');
      return false;
    }

    if (shipCondition < GAME_CONFIG.MIN_SHIP_CONDITION_FOR_TRAVEL) {
      showEvent('항해 불가', '선박 상태가 너무 나쁩니다. 수리가 필요합니다!', 'danger');
      return false;
    }

    setGold(prev => prev - totalCost);

    // 위험 이벤트 체크
    const riskRoll = Math.random() * 100;
    if (riskRoll < riskLevel) {
      const eventRoll = Math.random();

      if (eventRoll < 0.3) {
        // 해적 습격
        const goldLoss = Math.round(gold * GAME_CONFIG.PIRATE_GOLD_LOSS_RATE);
        setGold(prev => Math.max(0, prev - goldLoss));
        showEvent('해적 습격!', `${goldLoss.toLocaleString()} 두카트를 빼앗겼습니다!`, 'danger');
        addLog(`해적 습격! ${goldLoss.toLocaleString()} 두카트 손실`);
      } else if (eventRoll < 0.6) {
        // 폭풍
        setShipCondition(prev => Math.max(0, prev - GAME_CONFIG.STORM_SHIP_DAMAGE));
        setInventory(prev => {
          const newInventory = { ...prev };
          Object.keys(newInventory).forEach(good => {
            if (GOODS[good].perishable) {
              const loss = Math.floor(newInventory[good] * GAME_CONFIG.STORM_CARGO_LOSS_RATE);
              newInventory[good] -= loss;
              if (loss > 0) addLog(`폭풍으로 ${good} ${loss}개 손실`);
            }
          });
          return newInventory;
        });
        showEvent('폭풍우!', '배가 손상되고 부패품이 손실되었습니다!', 'warning');
      } else {
        // 선원 질병
        const crewLoss = Math.floor(crew * GAME_CONFIG.ILLNESS_CREW_LOSS_RATE);
        setCrew(prev => Math.max(GAME_CONFIG.MIN_CREW, prev - crewLoss));
        showEvent('괴혈병 발생!', `선원 ${crewLoss}명이 사망했습니다.`, 'danger');
        addLog(`괴혈병 발생! 선원 ${crewLoss}명 사망`);
      }
    }

    setCurrentCity(destination);

    // 시간 경과
    let newMonth = month + distance;
    let newYear = year;
    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);

    // 재고 리필 (시간 경과에 따라)
    setCityStocks(prev => refillStocks(prev, distance));

    updatePrices();
    addLog(`${destination}에 도착 (${distance}개월, ${totalCost.toLocaleString()} 두카트)`);

    return true;
  }, [currentCity, crew, gold, shipCondition, month, year, showEvent, addLog, updatePrices]);

  // 선박 수리
  const repairShip = useCallback(() => {
    const repairCost = (GAME_CONFIG.MAX_SHIP_CONDITION - shipCondition) * GAME_CONFIG.REPAIR_COST_PER_POINT;

    if (shipCondition >= GAME_CONFIG.MAX_SHIP_CONDITION) {
      showEvent('수리 불필요', '선박 상태가 양호합니다.', 'warning');
      return false;
    }

    if (gold < repairCost) {
      showEvent('수리 실패', '비용이 부족합니다!', 'danger');
      return false;
    }

    setGold(prev => prev - repairCost);
    setShipCondition(GAME_CONFIG.MAX_SHIP_CONDITION);
    addLog(`선박 수리 완료 (${repairCost.toLocaleString()} 두카트)`);
    showEvent('수리 완료', '선박이 완전히 수리되었습니다!', 'success');

    return true;
  }, [gold, shipCondition, showEvent, addLog]);

  // 선원 고용
  const hireCrew = useCallback(() => {
    const hireCost = GAME_CONFIG.CREW_HIRE_COUNT * GAME_CONFIG.CREW_HIRE_COST;

    if (crew >= GAME_CONFIG.MAX_CREW) {
      showEvent('고용 불가', '선원이 이미 충분합니다.', 'warning');
      return false;
    }

    if (gold < hireCost) {
      showEvent('고용 실패', '비용이 부족합니다!', 'danger');
      return false;
    }

    setGold(prev => prev - hireCost);
    setCrew(prev => Math.min(GAME_CONFIG.MAX_CREW, prev + GAME_CONFIG.CREW_HIRE_COUNT));
    addLog(`선원 ${GAME_CONFIG.CREW_HIRE_COUNT}명 고용 (${hireCost} 두카트)`);
    showEvent('고용 완료', `${GAME_CONFIG.CREW_HIRE_COUNT}명의 선원이 승선했습니다!`, 'success');

    return true;
  }, [gold, crew, showEvent, addLog]);

  // 최대 구매 수량 계산 (재고 고려)
  const getMaxBuyQuantity = useCallback((good: string) => {
    const maxByGoldAndCargo = calculateMaxBuyQuantity(
      good,
      gold,
      inventory,
      prices[currentCity],
      GAME_CONFIG.MAX_CARGO
    );
    const availableStock = cityStocks[currentCity]?.[good] ?? 0;
    return Math.min(maxByGoldAndCargo, availableStock);
  }, [gold, inventory, prices, currentCity, cityStocks]);

  // 현재 도시의 재고 가져오기
  const getCurrentCityStocks = useCallback(() => {
    return cityStocks[currentCity] || {};
  }, [cityStocks, currentCity]);

  // 최대 재고 가져오기
  const getGoodMaxStock = useCallback((good: string) => {
    return getMaxStock(currentCity, good);
  }, [currentCity]);

  return {
    // 상태
    gold,
    currentCity,
    year,
    month,
    inventory,
    averagePrices,
    shipCondition,
    crew,
    prices,
    logs,
    rumors,
    tradeCount,
    highestAssets,
    totalAssets,
    titleInfo,
    totalCargo,
    isClient,
    currentEvent,
    isEventModalOpen,
    showTitleCelebration,
    newTitleInfo,
    showRecordBadge,
    animateTradeCount,
    cityStocks,

    // 액션
    buyGood,
    sellGood,
    travel,
    repairShip,
    hireCrew,
    getMaxBuyQuantity,
    getCurrentCityStocks,
    getGoodMaxStock,
    showEvent
  };
}
