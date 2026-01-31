interface TitleCelebrationModalProps {
  title: string;
  icon: string;
}

export function TitleCelebrationModal({ title, icon }: TitleCelebrationModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="animate-title-celebration">
        <div className="parchment rounded-xl p-8 text-center shadow-2xl border-4 border-[#c9a227]">
          <div className="text-6xl mb-4 animate-bounce-slow">{icon}</div>
          <div className="text-2xl font-bold text-[#c9a227] mb-2">축하합니다!</div>
          <div className="text-3xl font-bold text-[#3d2314] mb-2">{title}</div>
          <div className="text-sm text-[#3d2314]/70">새로운 칭호를 획득했습니다!</div>
          <div className="mt-4 flex justify-center gap-2">
            {['🎉', '⭐', '🎊', '✨', '🎉'].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-sparkle"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
