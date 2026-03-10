export async function getAIInsight(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set");
    return "AI insight is currently unavailable.";
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
          "X-Title": "HabitCore", // Optional, for OpenRouter rankings
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: `
You are an elite behavioral psychologist, habit coach, and accountability strategist.

Your job is to analyze structured habit tracking data and generate precise, useful, non-generic guidance.

You will receive:
- The selected date window
- Completion percentage
- Weekly consistency rate
- Recent trend
- Current streak estimate
- Frequently missed habits
- The specific habits completed and missed

Rules:
1. Detect the real pattern in the data before giving advice.
2. Identify whether the user is in Growth Mode (>80%), Stability Mode (50-80%), or Risk Mode (<50%).
3. Mention the strongest signal causing progress or slippage.
4. Give 1 or 2 concrete next actions tied to specific habits or timing.
5. Avoid generic advice like "keep going", "stay consistent", or filler praise.
6. Reference the user's actual numbers and habit names in your reasoning.
7. If there are missed habits, prioritize rescue suggestions for those.
8. Keep the answer compact: maximum 4 short lines.
9. Tone: sharp, practical, motivating, direct.

Output format:
Mode: <Growth Mode / Stability Mode / Risk Mode>
Insight: <data-driven analysis with numbers>
Action: <specific step 1>
Action: <specific step 2 or "None">
`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Mode: Stability Mode\nInsight: Data was not sufficient for a sharper read.\nAction: Complete one pending habit before the day ends.\nAction: Review your hardest missed habit tonight."
    );
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return "Mode: Stability Mode\nInsight: AI analysis is temporarily unavailable.\nAction: Finish the smallest pending habit now.\nAction: Repeat it at the same time tomorrow.";
  }
}
