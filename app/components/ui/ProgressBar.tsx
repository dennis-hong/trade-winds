interface ProgressBarProps {
  value: number;
  max: number;
  type?: 'health' | 'danger' | 'warning';
}

export function ProgressBar({ value, max, type = 'health' }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  const fillClass = percentage > 60 ? 'health' : percentage > 30 ? 'warning' : 'danger';

  return (
    <div className="progress-bar h-3 w-full">
      <div
        className={`progress-fill ${type === 'health' ? fillClass : type}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
