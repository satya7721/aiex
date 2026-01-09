import { NextResponse } from "next/server";
import { OpenRouter } from "@openrouter/sdk";
import crypto from "crypto";
import { Exam, Question } from "@/types";

/* -------------------- Types -------------------- */
type Difficulty = "easy" | "medium" | "hard";

type GenerateExamRequest = {
    subject: string;
    topics: string[];
    difficulty: Difficulty;
    questionCount: number;
    durationMinutes: number;
    // Optional context fields to pass through
    class?: string;
    division?: string;
    totalMarks?: number;
};

/* -------------------- OpenRouter -------------------- */
const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

/* -------------------- Utils -------------------- */
const uid = () => crypto.randomBytes(8).toString("hex");

function buildPrompt(input: GenerateExamRequest) {
    return `
Generate an exam paper.
Return ONLY valid JSON. No markdown. No explanation text.

Constraints:
- Subject: ${input.subject}
- Topics: ${input.topics.join(", ")}
- Difficulty: ${input.difficulty}
- Total questions: ${input.questionCount}
- Duration: ${input.durationMinutes} minutes
- Include MCQ and Text (Subjective) questions
- MCQ must have exactly 4 options
- correctOptionIndex must be between 0-3
- No duplicate questions

JSON Schema:
{
  "title": string,
  "subject": string,
  "topics": string[],
  "durationMinutes": number,
  "questions": [
    {
      "type": "mcq",
      "text": string,
      "options": string[],
      "correctOption": number,
      "explanation": string,
      "marks": number
    },
    {
      "type": "subjective",
      "text": string,
      "expectedAnswerPoints": string[],
      "keywords": string[],
      "marks": number
    }
  ]
}

Return JSON now.
`.trim();
}

function safeJsonParse(text: string) {
    const trimmed = text.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1) {
        throw new Error("Invalid JSON from AI");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
}

function normalizeExam(raw: any, input: GenerateExamRequest): Exam {
    const questions: Question[] = raw.questions.map((q: any) => {
        if (q.type === "mcq") {
            return {
                id: uid(),
                text: q.text || q.prompt, // Handle potential AI variance
                type: "mcq",
                options: q.options ? q.options.slice(0, 4) : [],
                correctOption: q.correctOption ?? q.correctOptionIndex,
                marks: q.marks ?? 1,
            };
        }
        // Subjective/Text
        return {
            id: uid(),
            text: q.text || q.prompt,
            type: "subjective",
            marks: q.marks ?? 5,
        };
    });

    // Calculate total marks if not provided
    const calculatedTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    return {
        id: uid(),
        title: raw.title ?? "Generated Exam",
        subject: raw.subject ?? input.subject,
        class: input.class || "Unknown",
        division: input.division || "A",
        duration: raw.durationMinutes || input.durationMinutes,
        totalMarks: input.totalMarks || calculatedTotalMarks,
        questions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

/* -------------------- API Handler -------------------- */
export async function POST(req: Request) {
    try {
        const body: GenerateExamRequest = await req.json();

        if (!body.subject) {
            throw new Error("Invalid request payload: Subject is required");
        }
        // Default topics if empty
        if (!body.topics?.length) {
            body.topics = ["General"];
        }

        const prompt = buildPrompt(body);

        const stream = await openrouter.chat.send({
            model: "google/gemini-2.0-flash-001", // Updated to a valid robust model
            messages: [{ role: "user", content: prompt }],
            stream: true,
            // streamOptions: { includeUsage: true }, // sdk types might vary, kept simple
        });

        let rawResponse = "";

        // The OpenRouter SDK stream handling
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) rawResponse += content;
        }

        const parsed = safeJsonParse(rawResponse);
        const exam = normalizeExam(parsed, body);

        return NextResponse.json({ ok: true, exam });
    } catch (error: any) {
        console.error("Exam Generation Error:", error);
        return NextResponse.json(
            { ok: false, error: error.message || "Exam generation failed" },
            { status: 400 }
        );
    }
}
