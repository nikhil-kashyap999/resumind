import { generateJson } from "@/lib/gemini";
import { z } from "zod";

const Result = z.object({
    matchScore: z.number().min(0).max(100),
    matchedSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    suggestions: z.array(z.string()),
});

// const Input = z.object({
//     resume: z.string().min(50).max(15000),
//     jd: z.string().min(50).max(8000),
// });


const hits = new Map<string, number[]>();
function limited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > 5;
}

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    if (limited(ip))
        return Response.json({ error: "Too many requests, try later" }, { status: 429 });

    let form: FormData;
    try {
        form = await req.formData();
    } catch {
        return Response.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = form.get("resume");
    const jd = String(form.get("jd") ?? "");

    if (!(file instanceof File) || file.type !== "application/pdf")
        return Response.json({ error: "Only PDF supported for now" }, { status: 400 });
    if (file.size > 4 * 1024 * 1024)
        return Response.json({ error: "PDF should be less than 4MB" }, { status: 400 });
    if (jd.length < 50 || jd.length > 8000)
        return Response.json({ error: "JD must be 50-8000 characters" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.subarray(0, 4).toString() !== "%PDF")
        return Response.json({ error: "File is not a valid PDF" }, { status: 400 });

    const base64 = buffer.toString("base64");

    const prompt = `You are a strict technical recruiter. Compare the attached resume (PDF) with the job description below.
Return JSON with exactly these keys:
- matchScore: integer 0-100
- matchedSkills: string[] (skills present in both)
- missingSkills: string[] (required in JD but absent in resume)
- suggestions: string[] (max 5, specific and actionable)
Base everything only on the resume and the job description.

JOB DESCRIPTION:
${jd}`;

    try {
        const parts = [
            { inlineData: { mimeType: "application/pdf", data: base64 } },
            { text: prompt },
        ];
        const { data, model } = await generateJson(parts, (raw) =>
            Result.parse(JSON.parse(raw))
        );
        console.log("served by:", model);
        return Response.json(data);
    } catch (e) {
        console.error(e);
        return Response.json(
            { error: "AI models are busy, try again in a minute" },
            { status: 503 }
        );
    }
}