import { generateJson } from "@/lib/gemini";
import { z } from "zod";

const Result = z.object({
    matchScore: z.number().min(0).max(100),
    matchedSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    suggestions: z.array(z.string()),
});

const Input = z.object({
    resume: z.string().min(50).max(15000),
    jd: z.string().min(50).max(8000),
});


const hits = new Map<string, number[]>();
function limited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > 5;
}

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') ?? "local";
    if (limited(ip)) {
        return Response.json({ error: "Too many requests, Try later" }, { status: 429 });
    }
    const parsed = Input.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return Response.json({ error: "Resume and JD must be minimum 50 character long" }, { status: 400 });
    }
    const { resume, jd } = parsed.data;
    const prompt = `You are a strict technical recruiter. Compare the resume with the job description.
    Return JSON with exactly these keys:
    - matchScore: integer 0-100
    - matchedSkills: string[] (skills present in both)
    - missingSkills: string[] (required in JD but absent in resume)
    - suggestions: string[] (max 5, specific and actionable)
    Base everything only on the text below.

    RESUME:
    ${resume}
    JOB DESCRIPTION:
    ${jd}`;

    try {
        const { data, model } = await generateJson(prompt, (raw) => Result.parse(JSON.parse(raw)));
        console.log("served by:", model);
        return Response.json(data);
    } catch (e: any) {
        return Response.json({ error: "AI models are busy, try 1 minute later" }, { status: 503 })
    }
}