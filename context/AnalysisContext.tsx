"use client"
import { AnalysisResultData } from "@/types/AnalysisResultType";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type DefaultType = {
  result: AnalysisResultData | null;
  setResult: Dispatch<SetStateAction<AnalysisResultData | null>>;
};

const AnalysisResultContext = createContext<DefaultType | null>(null);
export function AnalysisResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  return (
    <AnalysisResultContext.Provider value={{ result, setResult }}>
      {children}
    </AnalysisResultContext.Provider>
  );
}

export function useAnalysisResult() {
  const context = useContext(AnalysisResultContext);

  if (!context) {
    throw new Error(
      "useAnalysisResult must be used within AnalysisResultProvider",
    );
  }

  return context;
}
