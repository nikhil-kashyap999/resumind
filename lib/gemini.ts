import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODELS: string[] = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash'];

const TIMEOUT_MS = 15_000;
const RETRYABLE = [404, 429, 500, 503, 504];

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { staus: 504 })), ms))]);
}


export async function generateJson<T>(
    prompt: string,
    parse: (raw: string) => T
): Promise<{ data: T; model: string }> {
    const errors: string[] = [];

    for (const model of MODELS) {
        try {
            const res = await withTimeout(
                ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: { responseMimeType: "application/json" },
                }),
                TIMEOUT_MS
            );
            const raw = (res.text ?? "").replace(/```json|```/g, "").trim();
            return { data: parse(raw), model }; // galat JSON/zod fail => agla model
        } catch (e: any) {
            const retryable =
                e instanceof SyntaxError || e?.name === "ZodError" || RETRYABLE.includes(e?.status);
            errors.push(`${model}: ${e?.status ?? e?.name ?? e?.message}`);
            if (!retryable) throw e; // jaise 401/400, turant dikhao
        }
    }
    throw new Error(`All models failed -> ${errors.join(" | ")}`);
}