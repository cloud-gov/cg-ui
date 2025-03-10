'use client';

import { useLayoutEffect, useRef } from 'react';
import { InfinitySVG } from '@/components/svgs/InfinitySVG';

export function ProgressBar({
  total, // number representing total length of bar
  fill, // number representing how much bar should be filled
  threshold1 = 75, // percentage where color should change first, between 0 and 100
  threshold2 = 90, // percentage where color should change next, between 0 and 100
  changeColors = true,
}: {
  total: number | null | undefined;
  fill: number;
  threshold1?: number;
  threshold2?: number;
  changeColors?: boolean;
}) {
  const heightClass = 'height-1';
  const percentage = total ? Math.floor((fill / total) * 100) : 100;
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${percentage}%`;
    }
  }, [percentage]);

  let color = 'bg-mint';
  if (changeColors && percentage > threshold1 && percentage < threshold2) {
    color = 'bg-red-30v';
  }
  if (changeColors && percentage > threshold2) {
    color = 'bg-red-40v';
  }
  if (!total) {
    color = 'progress__bg--infinite';
  }
  return (
    <div
      className={`${heightClass} width-full bg-base-lighter radius-pill position-relative`}
    >
      <div
        className={`${heightClass} radius-pill ${color}`}
        data-testid="progress"
        ref={barRef}
      ></div>
      {!total && (
        <span className="progress__infinity-logo">
          <InfinitySVG />
        </span>
      )}
    </div>
  );
}
