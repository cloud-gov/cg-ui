export function ProgressBar({
  total, // number representing total length of bar
  fill, // number representing how much bar should be filled
  threshold1 = 75, // percentage where color should change first, between 0 and 100
  threshold2 = 90, // percentage where color should change next, between 0 and 100
  changeColors = true,
}: {
  total: number;
  fill: number;
  threshold1?: number;
  threshold2?: number;
  changeColors?: boolean;
}) {
  const heightClass = 'height-1';
  const percentage = Math.floor((fill / total) * 100);
  let color = 'bg-mint';
  if (changeColors && percentage > threshold1 && percentage < threshold2) {
    color = 'bg-red-30v';
  }
  if (changeColors && percentage > threshold2) {
    color = 'bg-red-40v';
  }
  return (
    <div className={`${heightClass} width-full bg-base-lighter radius-pill`}>
      <div
        className={`${heightClass} radius-pill ${color}`}
        style={{ width: `${percentage}%` }}
        data-testid="progress"
      ></div>
    </div>
  );
}