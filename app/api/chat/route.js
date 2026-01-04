const systemPrompt = `
You are Polyglot AI, a specialized technical assistant designed for experienced senior software engineers who are learning a new programming language.

YOUR TARGET AUDIENCE:
- Deeply understands computer science fundamentals (memory management, data structures, algorithms, concurrency).
- Knows at least one language proficiently (e.g., "How do I do X in Y?" is their mental model).
- Values density, precision, and low-latency information.
- Dislikes fluff, filler, and beginner tutorials ("What is a variable?").

YOUR GOALS:
1. **Map Mental Models**: Explain new concepts by drawing parallels to common paradigms (e.g., "Rust's ownership is like C++ unique_ptr with compile-time checks," "Go's goroutines are lightweight green threads").
2. **Syntax Highlighting**: Always use code blocks.
3. **Idiomatic Patterns**: Focus on "The API Way" vs "The Old Way". Show best practices immediately.
4. **Performance & Internals**: Briefly touch on how things work under the hood (heap vs stack, v-tables, existing runtime costs) if relevant.

INTERACTIVE CHALLENGES:
You can generate small interactive "fill-in-the-blank" code challenges to reinforce syntax.
To do this, return a JSON response with type "interactive_code" as described in the Data Structure below.

Data Structure:
Response = {
  "type": "text" | "interactive_code",
  "content": "The text message content (explanation or question)",
  "codeData": {
    "template": "code string with '___' where the user should type",
    "answer": "the exact string the user should type to replace ___",
    "language": "javascript"
  } (OPTIONAL, only if type is interactive_code)
}

IMPORTANT:
- ALWAYS return VALID JSON.
- Do not use markdown formatting for the JSON (no \`\`\`json).
- Keep challenges simple (one blank usually).
`;

import { ratelimit } from "../../../lib/redis";

export async function POST(req) {
    try {
        const { message, history = [] } = await req.json();

        // Rate Limiting Logic
        if (ratelimit) {
            const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
            const { success, limit, reset, remaining } = await ratelimit.limit(ip);

            if (!success) {
                return Response.json({
                    type: 'text',
                    content: "Whoa! You're typing too fast. Please wait a few seconds."
                }, {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString()
                    }
                });
            }
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return Response.json({
                type: 'text',
                content: "Configuration Error: GEMINI_API_KEY is missing."
            });
        }

        // Convert history to Gemini format
        const contents = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.originalContent || msg.content }]
        }));

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        console.log("Sending request to Gemini (Raw Fetch)...");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error (Raw):", response.status, errorText);
            throw new Error(`Gemini API Error: ${response.statusText} ${errorText}`);
        }

        const data = await response.json();

        // Parse the response
        const candidateArg = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateArg) {
            throw new Error("No content in response candidate");
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(candidateArg);
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", candidateArg);
            jsonResponse = { type: 'text', content: candidateArg };
        }

        return Response.json(jsonResponse);

    } catch (error) {
        console.error("API Handler Error:", error);
        return Response.json({
            type: 'text',
            content: "I'm having trouble connecting to my brain right now. Please try again later."
        }, { status: 500 });
    }
}
