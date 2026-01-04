const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // There isn't a direct "listModels" on the instance easily accessible without the model manager usually, 
        // but we can try to just run a simple prompt on gemini-1.5-flash to see if it works in isolation.

        // Actually, let's try to infer from a simple generation attempt.
        console.log("Testing gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash success:", resultFlash.response.text());

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
