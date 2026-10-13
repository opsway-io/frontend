import { useEffect, useState } from "react";

/** Current timestamp (ms), refreshed every `intervalMs`. */
const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
};

export default useNow;
