import { Compass } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="parchment rounded-xl p-6 max-w-md mx-4 text-[#3d2314]">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Compass className="w-8 h-8 text-[#c9a227]" />
          무역 가이드
        </h3>
        <div className="space-y-3 mb-6">
          <div className="bg-green-100 border-l-4 border-green-600 p-3 rounded">
            <p className="font-bold text-green-800">핵심 원칙</p>
            <p className="text-sm">원산지에서 싸게 사서, 비원산지에서 비싸게 팔아라!</p>
          </div>
          <div className="bg-blue-100 border-l-4 border-blue-600 p-3 rounded">
            <p className="font-bold text-blue-800">원산지 표시</p>
            <p className="text-sm">
              시장에서 <span className="bg-green-700 text-white px-1 rounded text-xs">원산지</span> 태그가 붙은 상품이 저렴합니다.
            </p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-3 rounded">
            <p className="font-bold text-yellow-800">부패품 주의</p>
            <p className="text-sm">폭풍을 만나면 부패품(와인, 향신료 등)이 손실될 수 있습니다.</p>
          </div>
          <div className="bg-purple-100 border-l-4 border-purple-600 p-3 rounded">
            <p className="font-bold text-purple-800">시작 팁</p>
            <p className="text-sm">리스본의 와인을 베네치아에서 팔면 큰 이익!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full btn-gold rounded-lg py-3 text-lg font-bold"
        >
          항해를 시작하자!
        </button>
      </div>
    </div>
  );
}
