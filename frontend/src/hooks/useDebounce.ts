// src/presentation/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value change.
 * @param value The value to debounce (e.g., search term)
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Cancel the timeout if value changes (or component unmounts)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Rerun effect if value or delay changes

  return debouncedValue;
}
