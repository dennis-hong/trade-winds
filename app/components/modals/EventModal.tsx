import type { GameEvent } from '../../types';

interface EventModalProps {
  event: GameEvent;
}

export function EventModal({ event }: EventModalProps) {
  const borderClass = {
    danger: 'border-red-600',
    success: 'border-green-600',
    warning: 'border-yellow-600'
  }[event.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`parchment rounded-xl p-6 text-center transform animate-bounce ${borderClass}`}>
        <h3 className="text-xl font-bold text-[#3d2314] mb-2">{event.title}</h3>
        <p className="text-[#3d2314]">{event.message}</p>
      </div>
    </div>
  );
}
