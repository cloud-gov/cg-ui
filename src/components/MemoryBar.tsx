import { ProgressBar } from '@/components/ProgressBar';
import { formatMb } from '@/helpers/numbers';

export function MemoryBar({
  memoryUsed,
  memoryAllocated,
  nonce,
}: {
  memoryUsed?: number | null | undefined;
  memoryAllocated?: number | null | undefined;
  nonce: string | undefined;
}) {
  const memoryUsedNum = memoryUsed || 0;
  const mbRemaining = (memoryAllocated || 0) - memoryUsedNum;
  return (
    <div className="margin-top-3" data-testid="memory-bar">
      <p className="font-sans-3xs text-uppercase text-bold">Memory:</p>

      <ProgressBar total={memoryAllocated} fill={memoryUsedNum} nonce={nonce} />

      <div className="margin-top-1 display-flex flex-justify font-sans-3xs">
        <div className="margin-right-1">
          {memoryAllocated && memoryAllocated > 0 && (
            <>
              {formatMb(memoryUsedNum)} used of {formatMb(memoryAllocated)}{' '}
              allocated
            </>
          )}
          {memoryAllocated === null && (
            <>{formatMb(memoryUsedNum)} used; no upper limit</>
          )}
        </div>
        {memoryAllocated && memoryAllocated > 0 && (
          <div className="maxw-15 text-right">
            {formatMb(mbRemaining)} remaining
          </div>
        )}
      </div>
    </div>
  );
}
