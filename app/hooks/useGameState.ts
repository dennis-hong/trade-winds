'use client';

import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG, CITIES, GOODS, SHIPS, SHIP_UPGRADES } from '../constants/gameData';
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
import type { Rumor, GameEvent, Quest } from '../types';
import {
  generateInitialQuests,
  generateQuest,
  updateQuestProgress,
  checkExpiredQuests
} from '../utils/quest';

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

  // 선박 시스템
  const [currentShip, setCurrentShip] = useState('카라벨');
  const [shipUpgrades, setShipUpgrades] = useState<string[]>([]);

  // 퀘스트 시스템
  const [quests, setQuests] = useState<Quest[]>([]);
  const [reputation, setReputation] = useState(0);

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
    // 초기 퀘스트 생성
    setQuests(generateInitialQuests(GAME_CONFIG.INITIAL_YEAR, GAME_CONFIG.INITIAL_MONTH, '리스본'));
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
    const maxCargo = getEffectiveShipStats().maxCargo;
    if (totalCargo + quantity > maxCargo) {
      showEvent('거래 실패', `선창 용량이 부족합니다! (최대: ${maxCargo})`, 'danger');
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

    // 퀘스트 진행 업데이트
    setQuests(prev => updateQuestProgress(prev, { type: 'buy', good, quantity }));

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

    // 퀘스트 진행 업데이트 (판매, 배달 퀘스트 포함)
    setQuests(prev => updateQuestProgress(prev, { type: 'sell', good, quantity, city: currentCity }));

    return true;
  }, [inventory, prices, currentCity, averagePrices, showEvent, addLog]);

  // 여행
  const travel = useCallback((destination: string) => {
    const distance = CITIES[currentCity].distances[destination];
    const riskLevel = CITIES[currentCity].risk[destination];
    const shipStats = getEffectiveShipStats();
    
    // 선박 속도에 따른 비용 조정
    const baseCost = calculateTravelCost(
      distance,
      crew,
      GAME_CONFIG.TRAVEL_BASE_COST_PER_DISTANCE,
      GAME_CONFIG.TRAVEL_CREW_COST_PER_DISTANCE
    );
    const totalCost = Math.round(baseCost * shipStats.speed);

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
        // 해적 습격 - 방어력에 따라 피해 감소 또는 격퇴
        const defenseRoll = Math.random() * 100;
        if (defenseRoll < shipStats.pirateDefense) {
          // 해적 격퇴 성공!
          showEvent('해적 격퇴!', `${currentShip}의 대포가 해적을 물리쳤습니다!`, 'success');
          addLog(`해적 격퇴 성공! (방어력: ${shipStats.pirateDefense}%)`);
        } else {
          const goldLoss = Math.round(gold * GAME_CONFIG.PIRATE_GOLD_LOSS_RATE);
          setGold(prev => Math.max(0, prev - goldLoss));
          showEvent('해적 습격!', `${goldLoss.toLocaleString()} 두카트를 빼앗겼습니다!`, 'danger');
          addLog(`해적 습격! ${goldLoss.toLocaleString()} 두카트 손실`);
        }
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

    // 퀘스트 진행 업데이트 (탐험 퀘스트)
    setQuests(prev => {
      let updated = updateQuestProgress(prev, { type: 'travel', city: destination });
      // 만료된 퀘스트 체크
      updated = checkExpiredQuests(updated, newYear, newMonth);
      return updated;
    });

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

  // 선박 유효 스탯 계산 (업그레이드 반영)
  const getEffectiveShipStats = useCallback(() => {
    const baseShip = SHIPS[currentShip];
    let maxCargo = baseShip.maxCargo;
    let speed = baseShip.speed;
    let durability = baseShip.durability;
    let pirateDefense = baseShip.pirateDefense;

    // 업그레이드 효과 적용
    shipUpgrades.forEach(upgradeId => {
      const upgrade = SHIP_UPGRADES.find(u => u.id === upgradeId);
      if (upgrade) {
        switch (upgrade.effect.type) {
          case 'cargo':
            maxCargo += upgrade.effect.value;
            break;
          case 'speed':
            speed += upgrade.effect.value;
            break;
          case 'durability':
            durability += upgrade.effect.value;
            break;
          case 'pirateDefense':
            pirateDefense += upgrade.effect.value;
            break;
        }
      }
    });

    // 구리 도금은 내구도도 추가로 +20
    if (shipUpgrades.includes('copper_plating')) {
      durability += 20;
    }

    return { maxCargo, speed, durability, pirateDefense };
  }, [currentShip, shipUpgrades]);

  // 최대 구매 수량 계산 (재고 고려)
  const getMaxBuyQuantity = useCallback((good: string) => {
    const effectiveMaxCargo = getEffectiveShipStats().maxCargo;
    const maxByGoldAndCargo = calculateMaxBuyQuantity(
      good,
      gold,
      inventory,
      prices[currentCity],
      effectiveMaxCargo
    );
    const availableStock = cityStocks[currentCity]?.[good] ?? 0;
    return Math.min(maxByGoldAndCargo, availableStock);
  }, [gold, inventory, prices, currentCity, cityStocks, getEffectiveShipStats]);

  // 현재 도시의 재고 가져오기
  const getCurrentCityStocks = useCallback(() => {
    return cityStocks[currentCity] || {};
  }, [cityStocks, currentCity]);

  // 최대 재고 가져오기
  const getGoodMaxStock = useCallback((good: string) => {
    return getMaxStock(currentCity, good);
  }, [currentCity]);

  // 선박 구매
  const buyShip = useCallback((shipName: string) => {
    const ship = SHIPS[shipName];
    if (!ship) {
      showEvent('구매 실패', '존재하지 않는 선박입니다.', 'danger');
      return false;
    }

    if (gold < ship.price) {
      showEvent('구매 실패', '두카트가 부족합니다!', 'danger');
      return false;
    }

    // 현재 화물이 새 선박의 용량을 초과하는지 체크
    if (totalCargo > ship.maxCargo) {
      showEvent('구매 실패', `화물이 너무 많습니다! (현재: ${totalCargo}, 새 선박 용량: ${ship.maxCargo})`, 'danger');
      return false;
    }

    setGold(prev => prev - ship.price);
    setCurrentShip(shipName);
    setShipCondition(ship.durability); // 새 선박은 최대 내구도
    setShipUpgrades([]); // 업그레이드 초기화
    addLog(`${ship.icon} ${shipName} 구매! (${ship.price.toLocaleString()} 두카트)`);
    showEvent('선박 구매 완료!', `${shipName}의 새 주인이 되셨습니다!`, 'success');

    return true;
  }, [gold, totalCargo, showEvent, addLog]);

  // 업그레이드 구매
  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = SHIP_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) {
      showEvent('구매 실패', '존재하지 않는 업그레이드입니다.', 'danger');
      return false;
    }

    if (shipUpgrades.includes(upgradeId)) {
      showEvent('구매 실패', '이미 장착된 업그레이드입니다.', 'warning');
      return false;
    }

    if (gold < upgrade.price) {
      showEvent('구매 실패', '두카트가 부족합니다!', 'danger');
      return false;
    }

    setGold(prev => prev - upgrade.price);
    setShipUpgrades(prev => [...prev, upgradeId]);
    addLog(`${upgrade.icon} ${upgrade.name} 업그레이드 장착!`);
    showEvent('업그레이드 완료!', `${upgrade.name}을(를) 장착했습니다!`, 'success');

    return true;
  }, [gold, shipUpgrades, showEvent, addLog]);

  // 실제 최대 적재량 (선박 + 업그레이드)
  const effectiveMaxCargo = getEffectiveShipStats().maxCargo;

  // 퀘스트 보상 수령
  const claimQuestReward = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'completed') {
      showEvent('보상 수령 실패', '완료되지 않은 의뢰입니다.', 'danger');
      return false;
    }

    // 보상 지급
    if (quest.reward.gold) {
      setGold(prev => prev + quest.reward.gold!);
    }
    if (quest.reward.reputation) {
      setReputation(prev => prev + quest.reward.reputation!);
    }

    // 퀘스트 제거
    setQuests(prev => prev.filter(q => q.id !== questId));
    
    addLog(`📜 의뢰 완료! "${quest.name}" (보상: ${quest.reward.gold?.toLocaleString() || 0}G)`);
    showEvent('의뢰 완료!', `${quest.reward.gold?.toLocaleString() || 0} 두카트와 명성 ${quest.reward.reputation || 0}을(를) 획득했습니다!`, 'success');

    return true;
  }, [quests, showEvent, addLog]);

  // 퀘스트 포기
  const abandonQuest = useCallback((questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
    addLog('📜 의뢰를 포기했습니다.');
    showEvent('의뢰 포기', '의뢰를 포기했습니다. 명성이 약간 감소합니다.', 'warning');
    setReputation(prev => Math.max(0, prev - 5));
    return true;
  }, [showEvent, addLog]);

  // 새 퀘스트 추가
  const refreshQuests = useCallback(() => {
    const activeCount = quests.filter(q => q.status === 'active').length;
    if (activeCount >= 5) {
      showEvent('의뢰 제한', '진행 중인 의뢰가 너무 많습니다! (최대 5개)', 'warning');
      return false;
    }

    const newQuest = generateQuest(year, month, currentCity, quests.map(q => q.id));
    setQuests(prev => [...prev, newQuest]);
    addLog(`📜 새 의뢰: "${newQuest.name}"`);
    showEvent('새 의뢰!', `${newQuest.giver}의 의뢰가 도착했습니다!`, 'success');

    return true;
  }, [quests, year, month, currentCity, showEvent, addLog]);

  // 자산 변경 시 퀘스트 업데이트 (부 축적 퀘스트)
  useEffect(() => {
    if (isClient) {
      setQuests(prev => updateQuestProgress(prev, { type: 'assets', totalAssets }));
    }
  }, [totalAssets, isClient]);

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

    // 선박 시스템
    currentShip,
    shipUpgrades,
    effectiveMaxCargo,

    // 퀘스트 시스템
    quests,
    reputation,

    // 액션
    buyGood,
    sellGood,
    travel,
    repairShip,
    hireCrew,
    getMaxBuyQuantity,
    getCurrentCityStocks,
    getGoodMaxStock,
    showEvent,
    buyShip,
    buyUpgrade,
    getEffectiveShipStats,
    claimQuestReward,
    abandonQuest,
    refreshQuests
  };
}
