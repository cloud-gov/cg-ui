import { ProgressBar } from '@/components/ProgressBar';
import { formatInt } from '@/helpers/numbers';

export function MemoryBar({
  memoryUsed,
  memoryAllocated,
}: {
  memoryUsed?: number | null | undefined;
  memoryAllocated?: number | null | undefined;
}) {
  if (!memoryAllocated) {
    return null;
  }
  const memoryUsedNum = memoryUsed || 0;
  const mbRemaining = memoryAllocated - memoryUsedNum;
  return (
    <div className="margin-top-3" data-testid="memory-bar">
      <p className="font-sans-3xs text-uppercase text-bold">Memory:</p>

      <ProgressBar total={memoryAllocated} fill={memoryUsedNum} />

      <div className="margin-top-1 display-flex flex-justify font-sans-3xs">
        <div className="">
          {formatInt(memoryUsedNum)}MB of {formatInt(memoryAllocated)}MB
          allocated
        </div>

        <div className="maxw-15">{formatInt(mbRemaining)}MB remaining</div>
      </div>
    </div>
  );
}
