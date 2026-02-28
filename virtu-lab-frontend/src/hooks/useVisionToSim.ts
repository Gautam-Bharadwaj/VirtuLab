import { useState } from "react";

export function useVisionToSim() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      // Stub — will be wired to vision API
      console.log("Analyze method stub for", file.name);
      setResult({ status: "stub" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, result, error, analyze };
}
