import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    errorHandler?: (error: Error) => void;
  } = {}
) {
  // Custom serialize/deserialize functions with defaults
  const serialize = options.serialize ?? JSON.stringify;
  const deserialize = options.deserialize ?? JSON.parse;
  const errorHandler = options.errorHandler ?? console.error;

  // Initialize state with a function to avoid unnecessary localStorage access
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      errorHandler(error as Error);
      return initialValue;
    }
  });

  // Memoized setter function to avoid recreating on every render
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serialize(valueToStore));
      } catch (error) {
        errorHandler(error as Error);
      }
    },
    [key, serialize, errorHandler, storedValue]
  );

  // Remove item from localStorage
  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      errorHandler(error as Error);
    }
  }, [key, initialValue, errorHandler]);

  // Sync state with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          errorHandler(error as Error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, errorHandler, initialValue]);

  return [storedValue, setValue, removeItem] as const;
}
