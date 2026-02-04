'use client';

import { useState } from 'react';
import { Compass, Ship } from 'lucide-react';

import { useGameState } from '../hooks';
import { getTradingRecommendations } from '../utils/trade';
import { TutorialModal, EventModal, TitleCelebrationModal } from './modals';
import {
  StatsHeader,
  RumorsPanel,
  MarketPanel,
  TradingPanel,
  NavigationPanel,
  CargoPanel,
  LogPanel,
  WorldMap,
  ShipyardPanel,
  QuestPanel
} from './panels';
import { MobileStatBar, MobileTabs, type TabType } from './ui';

export default function AgeOfSailGame() {
  // 게임 상태 훅
  const game = useGameState();

  // 로컬 UI 상태
  const [selectedGood, setSelectedGood] = useState('향신료');
  const [quantity, setQuantity] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('market');

  // 무역 추천 계산
  const recommendations = getTradingRecommendations(game.currentCity, game.prices);

  // 구매 핸들러
  const handleBuy = () => {
    game.buyGood(selectedGood, quantity);
  };

  // 판매 핸들러
  const handleSell = () => {
    game.sellGood(selectedGood, quantity);
  };

  // 최대 구매 핸들러
  const handleBuyMax = () => {
    const maxQty = game.getMaxBuyQuantity(selectedGood);
    if (maxQty > 0) {
      setQuantity(maxQty);
      game.buyGood(selectedGood, maxQty);
    } else {
      game.showEvent('거래 실패', '구매 가능한 수량이 없습니다!', 'danger');
    }
  };

  // 전량 판매 핸들러
  const handleSellAll = () => {
    const amount = game.inventory[selectedGood] || 0;
    if (amount > 0) {
      game.sellGood(selectedGood, amount);
    }
  };

  // 화물창에서 전량 판매
  const handleCargoSellAll = (good: string) => {
    const amount = game.inventory[good] || 0;
    if (amount > 0) {
      game.sellGood(good, amount);
    }
  };

  // 로딩 화면 (SSR hydration 방지)
  if (!game.isClient) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-16 h-16 text-[#c9a227] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#c9a227]">항해 준비 중...</h2>
          <p className="text-[#d4c49c] mt-2">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-2 md:p-6">
      {/* 모달들 */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {game.showTitleCelebration && game.newTitleInfo && (
        <TitleCelebrationModal
          title={game.newTitleInfo.title}
          icon={game.newTitleInfo.icon}
        />
      )}

      {game.isEventModalOpen && game.currentEvent && (
        <EventModal event={game.currentEvent} />
      )}

      {/* 헤더 - 모바일에서 콤팩트 */}
      <header className="text-center mb-3 md:mb-6">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 md:mb-2">
          <Compass className="w-6 h-6 md:w-10 md:h-10 text-[#c9a227] animate-wave" />
          <h1 className="text-2xl md:text-5xl font-bold text-[#c9a227] title-fancy">
            대항해시대
          </h1>
          <Ship className="w-6 h-6 md:w-10 md:h-10 text-[#c9a227] animate-wave" style={{ animationDelay: '0.5s' }} />
        </div>
        <p className="text-[#d4c49c] text-xs md:text-lg hidden md:block">Merchant Oracle - 위험을 무릅쓰고 부를 축적하라</p>
      </header>

      {/* 상태 헤더 */}
      <StatsHeader
        gold={game.gold}
        currentCity={game.currentCity}
        year={game.year}
        month={game.month}
        totalCargo={game.totalCargo}
        shipCondition={game.shipCondition}
        crew={game.crew}
        titleInfo={game.titleInfo}
        totalAssets={game.totalAssets}
        tradeCount={game.tradeCount}
        highestAssets={game.highestAssets}
        showRecordBadge={game.showRecordBadge}
        animateTradeCount={game.animateTradeCount}
      />

      {/* 소문 및 추천 */}
      <RumorsPanel
        rumors={game.rumors}
        recommendations={recommendations}
      />

      {/* 모바일 탭 네비게이션 */}
      <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 월드맵 - 데스크탑 */}
      <div className="hidden md:block mb-6">
        <WorldMap
          currentCity={game.currentCity}
          gold={game.gold}
          crew={game.crew}
          onTravel={game.travel}
        />
      </div>

      {/* 메인 컨텐츠 - 데스크탑 */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        <MarketPanel
          currentCity={game.currentCity}
          prices={game.prices}
          inventory={game.inventory}
          averagePrices={game.averagePrices}
          selectedGood={selectedGood}
          onSelectGood={setSelectedGood}
          stocks={game.getCurrentCityStocks()}
          getMaxStock={game.getGoodMaxStock}
        />
        <TradingPanel
          selectedGood={selectedGood}
          quantity={quantity}
          onQuantityChange={setQuantity}
          gold={game.gold}
          currentCity={game.currentCity}
          prices={game.prices}
          inventory={game.inventory}
          averagePrices={game.averagePrices}
          shipCondition={game.shipCondition}
          getMaxBuyQuantity={game.getMaxBuyQuantity}
          onBuy={handleBuy}
          onSell={handleSell}
          onBuyMax={handleBuyMax}
          onSellAll={handleSellAll}
          onRepairShip={game.repairShip}
          onHireCrew={game.hireCrew}
        />
        <NavigationPanel
          currentCity={game.currentCity}
          crew={game.crew}
          gold={game.gold}
          inventory={game.inventory}
          averagePrices={game.averagePrices}
          prices={game.prices}
          onTravel={game.travel}
        />
      </div>

      {/* 메인 컨텐츠 - 모바일 (탭별 표시) */}
      <div className="md:hidden">
        {activeTab === 'market' && (
          <MarketPanel
            currentCity={game.currentCity}
            prices={game.prices}
            inventory={game.inventory}
            averagePrices={game.averagePrices}
            selectedGood={selectedGood}
            onSelectGood={setSelectedGood}
            stocks={game.getCurrentCityStocks()}
            getMaxStock={game.getGoodMaxStock}
            onGoToTrade={(good) => {
              setSelectedGood(good);
              setActiveTab('trade');
            }}
          />
        )}
        {activeTab === 'trade' && (
          <TradingPanel
            selectedGood={selectedGood}
            quantity={quantity}
            onQuantityChange={setQuantity}
            gold={game.gold}
            currentCity={game.currentCity}
            prices={game.prices}
            inventory={game.inventory}
            averagePrices={game.averagePrices}
            shipCondition={game.shipCondition}
            getMaxBuyQuantity={game.getMaxBuyQuantity}
            onBuy={handleBuy}
            onSell={handleSell}
            onBuyMax={handleBuyMax}
            onSellAll={handleSellAll}
            onRepairShip={game.repairShip}
            onHireCrew={game.hireCrew}
            onBackToMarket={() => setActiveTab('market')}
          />
        )}
        {activeTab === 'navigate' && (
          <>
            <WorldMap
              currentCity={game.currentCity}
              gold={game.gold}
              crew={game.crew}
              onTravel={game.travel}
            />
            <div className="mt-4">
              <NavigationPanel
                currentCity={game.currentCity}
                crew={game.crew}
                gold={game.gold}
                inventory={game.inventory}
                averagePrices={game.averagePrices}
                prices={game.prices}
                onTravel={game.travel}
              />
            </div>
          </>
        )}
        {activeTab === 'quest' && (
          <QuestPanel
            quests={game.quests}
            year={game.year}
            month={game.month}
            onClaimReward={game.claimQuestReward}
            onAbandonQuest={game.abandonQuest}
            onRefreshQuests={game.refreshQuests}
            reputation={game.reputation}
          />
        )}
        {activeTab === 'shipyard' && (
          <ShipyardPanel
            currentCity={game.currentCity}
            currentShip={game.currentShip}
            shipUpgrades={game.shipUpgrades}
            gold={game.gold}
            onBuyShip={game.buyShip}
            onBuyUpgrade={game.buyUpgrade}
            getEffectiveShipStats={game.getEffectiveShipStats}
          />
        )}
        {activeTab === 'cargo' && (
          <>
            <CargoPanel
              inventory={game.inventory}
              averagePrices={game.averagePrices}
              currentCity={game.currentCity}
              prices={game.prices}
              onSellAll={handleCargoSellAll}
            />
            <div className="mt-4">
              <LogPanel logs={game.logs} />
            </div>
          </>
        )}
      </div>

      {/* 조선소 & 퀘스트 - 데스크탑 */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ShipyardPanel
          currentCity={game.currentCity}
          currentShip={game.currentShip}
          shipUpgrades={game.shipUpgrades}
          gold={game.gold}
          onBuyShip={game.buyShip}
          onBuyUpgrade={game.buyUpgrade}
          getEffectiveShipStats={game.getEffectiveShipStats}
        />
        <QuestPanel
          quests={game.quests}
          year={game.year}
          month={game.month}
          onClaimReward={game.claimQuestReward}
          onAbandonQuest={game.abandonQuest}
          onRefreshQuests={game.refreshQuests}
          reputation={game.reputation}
        />
      </div>

      {/* 하단 섹션 - 데스크탑만 */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CargoPanel
          inventory={game.inventory}
          averagePrices={game.averagePrices}
          currentCity={game.currentCity}
          prices={game.prices}
          onSellAll={handleCargoSellAll}
        />
        <LogPanel logs={game.logs} />
      </div>

      {/* 푸터 */}
      <footer className="text-center mt-4 md:mt-8 mb-14 md:mb-0 text-[#8b6914] text-[10px] md:text-sm">
        <p>Trade Winds - Age of Sail Trading Game</p>
      </footer>

      {/* 모바일 하단 고정 스탯바 */}
      <MobileStatBar
        gold={game.gold}
        totalAssets={game.totalAssets}
        titleIcon={game.titleInfo.icon}
        currentCity={game.currentCity}
        totalCargo={game.totalCargo}
        maxCargo={100}
      />
    </div>
  );
}
