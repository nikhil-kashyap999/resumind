"use client";

import { useRef, useState } from "react";
import {
  ArrowUpRight,
  FileText,
  UploadCloud,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ScanSearch,
} from "lucide-react";
import AnalysisResult from "@/components/AnalysisResult";
import { AnalysisResultData } from "@/types/AnalysisResultType";
import { useAnalysisResult } from "@/context/AnalysisContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const { setResult } = useAnalysisResult();

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please upload a PDF or Word document.");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleAnalyze = async () => {
    try {
      if (!resumeText.trim() || !jobDescription.trim()) {
        return;
      }

      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resumeText,
          jd: jobDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

      router.push("/result");
    } catch (error) {
      // console.error("Resume analysis error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (size: number) =>
    size < 1024 * 1024
      ? `${(size / 1024).toFixed(0)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] text-white selection:bg-black-500/30">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-gray-600/9 blur-[150px]" />

        <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-indigo-600/6 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6">
            <ScanSearch size={21} className="text-blue-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Resumind<span className="text-blue-400">.</span>
          </span>
        </div>
      </nav>
      {/* Main content */}
      <section
        id="analyser"
        className="relative z-10 mx-auto max-w-6xl px-5 pb-20 sm:px-8 "
      >
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-blue-300">
            <Sparkles size={14} />
            INTELLIGENT CAREER ANALYSIS
          </div>

          <h1 className="text-xl font-semibold leading-[1.15] tracking-tight sm:text-2xl">
            Your resume.
          </h1>

          <p className="mx-auto max-w-xl text-sm text-zinc-400 sm:text-sm mt-1">
            Stop guessing if your resume is good enough. Upload your resume, add
            your target job description, and let AI uncover your potential.
          </p>
        </div>

        {/* Input cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Resume upload */}
          <div className="group rounded-2xl border border-white/9 bg-[#111318]/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-white/20 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <FileText size={21} />
                </div>
                <div>
                  <h2 className="font-medium">Your Resume</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Upload your latest resume
                  </p>
                </div>
              </div>

              <span className="text-xs text-zinc-600">01 / 02</span>
            </div>
            {/*
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex min-h-63.75 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${
                dragging
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-white/15 bg-white/2 hover:border-blue-400/50 hover:bg-blue-500/4"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {file ? (
                <div
                  className="flex w-full items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/6 p-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                    <FileText size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatSize(file.size)}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 size={12} /> Uploaded
                    </p>
                  </div>

                  <button
                    onClick={removeFile}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-white/10 hover:text-white"
                    aria-label="Remove resume"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-blue-400 shadow-lg shadow-blue-500/5 transition group-hover:scale-105">
                    <UploadCloud size={30} />
                  </div>

                  <p className="text-sm font-medium text-zinc-200">
                    Drop your resume here
                  </p>

                  <p className="mt-2 text-xs text-zinc-500">
                    or click to browse files
                  </p>

                  <div className="mt-6 flex gap-2">
                    {["PDF", "DOC", "DOCX"].map((type) => (
                      <span
                        key={type}
                        className="rounded-md border border-white/10 bg-white/3 px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-500"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div> */}

            <div className="relative">
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setMessage("");
                }}
                placeholder={`Paste Your Resume description here...
Example:
        Professional Summary:
        Skills:
        Projects:
        Education:
        Certifications:
        Additional Information:
        Professional Experience:
  `}
                className="min-h-63.75 w-full resize-none rounded-xl border border-white/10 bg-white/2 p-5 text-sm leading-7 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-purple-400/50 focus:bg-purple-500/2"
              />

              <div className="absolute bottom-4 right-4 text-[11px] text-zinc-600">
                {jobDescription.length} characters
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-600">
              <ShieldCheck size={13} className="mr-1 inline text-emerald-500" />
              Your resume is used for analysis only.
            </p>
          </div>

          {/* Job description */}
          <div className="rounded-2xl border border-white/9 bg-[#111318]/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-white/20 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                  <ScanSearch size={21} />
                </div>
                <div>
                  <h2 className="font-medium">Job Description</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Paste your target job requirements
                  </p>
                </div>
              </div>

              <span className="text-xs text-zinc-600">02 / 02</span>
            </div>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setMessage("");
                }}
                placeholder={`Paste the job description here...
Example:

We are looking for a Full Stack Developer with experience in React, Next.js, Node.js, TypeScript and MongoDB.

                      Requirements:
                      • 2+ years of experience
                      • Strong JavaScript fundamentals
                      • REST API development
                      • Database management
                      • Problem-solving skills`}
                className="min-h-63.75 w-full resize-none rounded-xl border border-white/10 bg-white/2 p-5 text-sm leading-7 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-purple-400/50 focus:bg-purple-500/2"
              />

              <div className="absolute bottom-4 right-4 text-[11px] text-zinc-600">
                {jobDescription.length} characters
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
              <span>Be specific for better results</span>
              <span>Plain text supported</span>
            </div>
          </div>
        </div>

        {/* Analyze action */}
        <div className="mx-auto mt-8 max-w-xl text-center">
          <button
            onClick={handleAnalyze}
            disabled={!resumeText || !jobDescription.trim() || loading}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-liner-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-semibold shadow-xl shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-70 cursor-pointer"
          >
            <Sparkles size={18} />
            {loading ? "Loading..." : "Analyze My Resume"}
            <ArrowUpRight
              size={18}
              className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>

          {message && <p className="mt-4 text-xs text-blue-300">{message}</p>}

          <p className="mt-5 text-xs text-zinc-600">
            <Zap size={12} className="mr-1 inline text-yellow-500" />
            AI-powered insights · Skill matching · ATS feedback
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-7 text-xs text-zinc-600 sm:flex-row">
          <p>© 2026 Resumind. Built for better careers.</p>
          <p>Think smarter. Apply better.</p>
        </footer>
      </section>
    </main>
  );
}
