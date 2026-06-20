import { useEffect, useState, useRef, useCallback } from "react";
 
/**
 * Real masonry: measures each image's natural aspect ratio after it loads,
 * then distributes items into columns by picking whichever column is
 * currently shortest (classic Pinterest-style packing), instead of relying
 * on a fixed CSS column-count which just lays items left-to-right blindly.
 */
export function useMasonry<T extends { id: number | string; src: string }>(
  items: T[],
  columnCount: number
) {
  const [columns, setColumns] = useState<T[][]>([]);
  const heightsRef = useRef<Map<string | number, number>>(new Map());
  // Bumped every time a new image height is measured, to trigger a recalc.
  const [recalcTrigger, setRecalcTrigger] = useState(0);
 
  const registerHeight = useCallback((id: string | number, aspect: number) => {
    // Avoid pointless re-renders if this id was already measured with the same value
    if (heightsRef.current.get(id) === aspect) return;
    heightsRef.current.set(id, aspect);
    setRecalcTrigger((n) => n + 1);
  }, []);
 
  useEffect(() => {
    const cols: T[][] = Array.from({ length: columnCount }, () => []);
    const colHeights = new Array(columnCount).fill(0);
 
    for (const item of items) {
      // Use measured aspect ratio if we have it, else assume a square as a placeholder
      const aspect = heightsRef.current.get(item.id) ?? 1;
      // Find the column with the smallest accumulated height
      let shortestCol = 0;
      for (let c = 1; c < columnCount; c++) {
        if (colHeights[c] < colHeights[shortestCol]) shortestCol = c;
      }
      cols[shortestCol].push(item);
      // Assume a fixed column width of 1 unit; accumulated "height" is 1/aspect
      colHeights[shortestCol] += 1 / aspect;
    }
 
    setColumns(cols);
  }, [items, columnCount, recalcTrigger]);
 
  return { columns, registerHeight };
}
 