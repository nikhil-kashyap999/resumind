"use client";

import { AnalysisResultData } from "@/types/AnalysisResultType";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleAlert,
  FileText,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

type AnalysisResultProps = {
  result: AnalysisResultData;
  onBack?: () => void;
  onReanalyze?: () => void;
};

export default function AnalysisResult({
  result,
  onBack,
  onReanalyze,
}: AnalysisResultProps) {
  const { matchScore, matchedSkills, missingSkills, suggestions } = result;

  const circumference = 2 * Math.PI * 52;
  const progress = (matchScore / 100) * circumference;

  const scoreColor =
    matchScore >= 80 ? "#34d399" : matchScore >= 60 ? "#60a5fa" : "#fb923c";

  const scoreLabel =
    matchScore >= 80
      ? "Strong Match"
      : matchScore >= 60
        ? "Good Potential"
        : "Needs Improvement";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] px-5 py-10 text-white sm:px-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/8 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/7 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={19} className="text-blue-400" />
              <span className="text-lg font-semibold tracking-tight">
                Resumind<span className="text-blue-400">.</span>
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              AI Resume Analysis / Results
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </header>

        {/* Title */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
            <Target size={14} />
            Analysis Complete
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your resume analysis.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Here's how your resume performs against the job description, along
            with actionable ways to improve your chances.
          </p>
        </section>

        {/* Score + Stats */}
        <section className="mb-6 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          {/* Score Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/9 bg-[#111318] p-7 sm:p-9">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/7 blur-[80px]" />

            <div className="relative flex flex-col items-center justify-between gap-8 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-sm text-zinc-500">Overall compatibility</p>

                <h2 className="mt-3 text-2xl font-semibold">{scoreLabel}</h2>

                <p className="mt-2 max-w-55 text-xs leading-6 text-zinc-500">
                  Your resume matches {matchScore}% of the evaluated job
                  requirements.
                </p>

                <div
                  className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs"
                  style={{
                    color: scoreColor,
                    borderColor: `${scoreColor}35`,
                    backgroundColor: `${scoreColor}10`,
                  }}
                >
                  <TrendingUp size={14} />
                  {matchScore}% Match Score
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
                <svg viewBox="0 0 120 120" className="-rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="#272a32"
                    strokeWidth="9"
                    fill="none"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke={scoreColor}
                    strokeWidth="9"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    className="transition-all duration-1000"
                  />
                </svg>

                <div className="absolute text-center">
                  <span className="text-4xl font-bold tracking-tight">
                    {matchScore}
                  </span>
                  <span className="text-sm text-zinc-500">%</span>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                    Match
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-500/15 bg-[#111318] p-5 sm:p-6">
              <div className="mb-5 inline-flex rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>

              <p className="text-3xl font-semibold">{matchedSkills.length}</p>

              <p className="mt-2 text-xs text-zinc-500">Matched Skills</p>

              <p className="mt-4 text-[11px] text-emerald-400">
                Skills found in resume
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/15 bg-[#111318] p-5 sm:p-6">
              <div className="mb-5 inline-flex rounded-lg bg-orange-500/10 p-2.5 text-orange-400">
                <CircleAlert size={20} />
              </div>

              <p className="text-3xl font-semibold">{missingSkills.length}</p>

              <p className="mt-2 text-xs text-zinc-500">Missing Skills</p>

              <p className="mt-4 text-[11px] text-orange-400">
                Areas to improve
              </p>
            </div>
          </div>
        </section>

        {/* Skills Sections */}
        <section className="mb-6 grid gap-5 md:grid-cols-2">
          {/* Matched Skills */}
          <div className="rounded-2xl border border-white/9 bg-[#111318] p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <h3 className="font-semibold">Matched Skills</h3>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Skills identified in your resume
                </p>
              </div>

              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                {matchedSkills.length} Found
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-xs text-zinc-300 transition hover:border-emerald-500/40"
                >
                  <Check size={13} className="text-emerald-400" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="rounded-2xl border border-white/9 bg-[#111318] p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CircleAlert size={18} className="text-orange-400" />
                  <h3 className="font-semibold">Missing Skills</h3>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Requirements not clearly demonstrated
                </p>
              </div>

              <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">
                {missingSkills.length} Missing
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-lg border border-orange-500/15 bg-orange-500/5 px-3 py-2 text-xs leading-5 text-zinc-300 transition hover:border-orange-500/40"
                >
                  <X size={13} className="shrink-0 text-orange-400" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="rounded-2xl border border-white/9 bg-[#111318] p-6 sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Lightbulb size={19} className="text-yellow-400" />
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                Personalized suggestions to improve your resume.
              </p>
            </div>

            <span className="rounded-lg border border-blue-500/20 bg-blue-500/7 px-3 py-2 text-xs text-blue-300">
              {suggestions.length} Suggestions
            </span>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group flex gap-4 rounded-xl border border-white/6 bg-white/2 p-4 transition hover:border-blue-500/20 hover:bg-blue-500/3 sm:p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-1">
                  <p className="text-sm leading-7 text-zinc-300">
                    {suggestion}
                  </p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="mt-1 shrink-0 text-zinc-600 transition group-hover:text-blue-400"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/7 bg-white/2 p-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <FileText size={19} className="text-zinc-500" />
            <p className="text-xs text-zinc-500">
              Keep improving. Every iteration counts.
            </p>
          </div>

          <button
            onClick={onReanalyze}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500 sm:w-auto"
          >
            <RefreshCw size={15} />
            Analyze Another Resume
          </button>
        </div>

        <footer className="mt-12 border-t border-white/7 pt-6 text-center text-xs text-zinc-600">
          © 2026 Resumind. AI-powered career insights.
        </footer>
      </div>
    </main>
  );
}
