import { useEffect, useState } from "react";

export function useSSE<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
        setError(null);
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError(new Error("SSE connection error"));
      eventSource.close();
      
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        setRetry(r => r + 1); // trigger re-connect
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [url, retry]);

  return { data, error };
}
