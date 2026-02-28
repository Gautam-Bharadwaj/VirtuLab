import { useState } from "react";

export function useVisionToSim() {
  const [isLoading] = useState(false);
  const [result] = useState<unknown>(null);
  const [error] = useState<string | null>(null);

  const analyze = async (_file: File) => {
    // Stub — will be implemented later
  };

  return { isLoading, result, error, analyze };
}
