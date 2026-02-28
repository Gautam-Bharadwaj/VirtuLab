import { useState } from "react";

export function useVisionToSim() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (file: File) => {
    // Basic stub
    console.log("Analyze method stub for", file);
  };

  return { isLoading, result, error, analyze };
}
