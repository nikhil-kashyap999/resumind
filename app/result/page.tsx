"use client";
import { useEffect } from "react";
import AnalysisResult from "@/components/AnalysisResult";
import { useAnalysisResult } from "@/context/AnalysisContext";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const { result } = useAnalysisResult();

  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  if (!result) {
    return null;
  }

  return (
    <AnalysisResult
      result={result}
      onBack={() => router.back()}
      onReanalyze={() => router.push("/")}
    />
  );
}
