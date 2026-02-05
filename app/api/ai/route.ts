import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getCvData } from "@/src/data/cv-data";
import { isLocale, type Locale } from "@/src/i18n/locales";

export async function POST(req: Request) {
    try {
        const { question, locale, history } = (await req.json()) as {
            question?: string;
            locale?: string;
            history?: Array<
                | { q: string; a: string } // eski format (geriye dönük)
                | { role: "user" | "assistant"; content: string }
            >;
        };

        const q = (question ?? "").trim();
        if (!q) {
            return NextResponse.json({ error: "question_required" }, { status: 400 });
        }

        const safeLocale: Locale = isLocale(locale ?? "") ? (locale as Locale) : "tr";

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "missing_GEMINI_API_KEY" }, { status: 500 });
        }

        const cv = await getCvData();
        const cvJson = {
            profile: cv.profile,
            professionalSummary: cv.professionalSummary,
            skills: cv.skills,
            experience: cv.experience,
            education: cv.education,
            awards: cv.awards,
        };

        const lastRaw = (history ?? []).slice(-10);
        const last = lastRaw
            .map((m) => {
                if ("role" in m && typeof m.role === "string") {
                    return { role: m.role, content: (m as any).content as string };
                }
                return {
                    role: "user" as const,
                    content: (m as any).q as string,
                };
            })
            .filter((m) => typeof m.content === "string" && m.content.trim().length);

        const system = [
            "You are a professional portfolio assistant.",
            "Answer ONLY using the provided CV data. If the answer is not in the CV, say you don't know and suggest what info is missing.",
            safeLocale === "tr" ? "Reply in Turkish." : "Reply in English.",
            "Keep the answer concise, senior-engineer tone, no hype.",
        ].join("\n");

        const prompt = [
            system,
            "\nCV_DATA_JSON:",
            JSON.stringify(cvJson),
            last.length
                ? "\nCONVERSATION_CONTEXT_LAST_MESSAGES:"
                : "\nCONVERSATION_CONTEXT_LAST_MESSAGES: (none)",
            ...last.map((m, i) => {
                const who = m.role === "assistant" ? "ASSISTANT" : "USER";
                return `\n[${i + 1}] ${who}: ${m.content}`;
            }),
            "\nUSER_QUESTION:",
            q,
        ].join("\n");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContentStream(prompt);

        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) controller.enqueue(encoder.encode(text));
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-store",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}

