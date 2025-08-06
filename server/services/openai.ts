import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface CategorySuggestion {
  category: string;
  confidence: number;
  reasoning: string;
}

export async function suggestCategory(description: string): Promise<CategorySuggestion> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that categorizes activities. Given an activity description, suggest the most appropriate category from: work, personal, health, learning, leisure.

          Respond with JSON in this format:
          {
            "category": "work|personal|health|learning|leisure",
            "confidence": 0.0-1.0,
            "reasoning": "brief explanation of why this category was chosen"
          }

          Categories defined as:
          - work: Professional tasks, meetings, projects, career-related activities
          - personal: Personal errands, family time, household tasks, personal appointments
          - health: Exercise, medical appointments, mental health, wellness activities
          - learning: Education, skill development, reading, courses, tutorials
          - leisure: Entertainment, hobbies, games, relaxation, social activities`
        },
        {
          role: "user",
          content: description,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      category: result.category || "personal",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      reasoning: result.reasoning || "Default categorization",
    };
  } catch (error) {
    console.error("Failed to get AI category suggestion:", error);
    return {
      category: "personal",
      confidence: 0.1,
      reasoning: "AI categorization failed, defaulted to personal",
    };
  }
}

export async function generateProductivityInsights(activities: any[]): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a productivity coach. Analyze the user's activities and provide 3-5 actionable insights.

          Respond with JSON in this format:
          {
            "insights": [
              "insight 1",
              "insight 2",
              "insight 3"
            ]
          }`
        },
        {
          role: "user",
          content: `Analyze these activities: ${JSON.stringify(activities)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return ["Unable to generate insights at this time."];
  }
}
