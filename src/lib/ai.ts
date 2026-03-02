export async function getAIInsight(prompt: string) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.error("OPENROUTER_API_KEY is not set");
        return "AI insight is currently unavailable.";
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
                "X-Title": "HabitCore", // Optional, for OpenRouter rankings
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional habit coach and productivity expert. Analyze the user's habit data and provide short, actionable, and encouraging insights (max 2 sentences)."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No insights today. Keep up the good work!";
    } catch (error) {
        console.error("Error fetching AI insight:", error);
        return "Failed to fetch AI insight. Keep pushing!";
    }
}
