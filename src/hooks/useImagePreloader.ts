"use client";

import { useEffect, useRef, useState } from "react";

/**
 * First + last + successive midpoints, then the remaining indexes ascending —
 * scrubbing has usable frames across the whole timeline almost immediately.
 */
function priorityOrder(n: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < n && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(n - 1);
  for (let step = 2; step < n * 2; step *= 2) {
    for (let k = 1; k < step; k += 2) push(Math.round((k / step) * (n - 1)));
    if (seen.size === n) break;
  }
  for (let i = 0; i < n; i++) push(i);
  return order;
}

export function useImagePreloader(urls: string[], enabled = true) {
  const images = useRef<(HTMLImageElement | null)[]>([]);
  // Track which url list the count belongs to, so switching sequences
  // resets progress without a synchronous setState in the effect body.
  const [loaded, setLoaded] = useState<{ of: string[]; count: number }>({
    of: urls,
    count: 0,
  });

  useEffect(() => {
    if (!enabled || urls.length === 0) return;
    let cancelled = false;
    images.current = new Array(urls.length).fill(null);

    priorityOrder(urls.length).forEach((i) => {
      const img = new Image();
      img.src = urls[i];
      const settle = () => {
        if (cancelled) return;
        images.current[i] = img;
        setLoaded((prev) =>
          prev.of === urls
            ? { of: urls, count: prev.count + 1 }
            : { of: urls, count: 1 },
        );
      };
      if (img.decode) {
        img.decode().then(settle, settle);
      } else {
        img.onload = settle;
        img.onerror = settle;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [urls, enabled]);

  const count = loaded.of === urls ? loaded.count : 0;
  return { images, progress: urls.length ? count / urls.length : 1 };
}
