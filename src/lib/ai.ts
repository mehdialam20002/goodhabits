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
                     content: `
You are an elite behavioral psychologist and high-performance habit strategist.

Your job is to analyze structured habit tracking data and generate precise, data-aware insights.

You will receive:
- Completion percentage
- Weekly consistency rate
- Monthly trend (improving / declining / stable)
- Current streak
- Weak or frequently missed habits

Rules:
1. Detect performance pattern.
2. Identify whether user is in Growth Mode (>80%), Stability Mode (50-80%), or Risk Mode (<50%).
3. Give ONE specific improvement recommendation.
4. Avoid generic advice like "keep going".
5. Reference the user's data in your reasoning.
6. Keep response under 3 sentences.
7. Tone: intelligent, strategic, motivating but not cheesy.

Output format:
Insight: <data-driven analysis>
Action: <clear adjustment suggestion>
`
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
