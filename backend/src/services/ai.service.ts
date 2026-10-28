import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { MaintenanceAiResult } from "../types/ai.types.js";
import { AIManagerInsights } from "../types/ai-insights.types.js";
type ManagerInsightInput ={
    title?:string;
    description?:string;
    aiSummary?:string;
    category?: string;
    priority?: string;
    status?: string;
    createdAt?: Date | string;
}
type ManagerInsightText = Pick<
    AIManagerInsights,
    "insights" | "recommendations"
>;

const isManagerInsightText = (
    value: unknown
): value is ManagerInsightText => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const result = value as Record<string, unknown>;

    return (
        typeof result.insights === "string" &&
        result.insights.trim().length > 0 &&
        Array.isArray(result.recommendations) &&
        result.recommendations.length > 0 &&
        result.recommendations.every(
            (item) =>
                typeof item === "string" &&
                item.trim().length > 0
        )
    );
};
const ai = new GoogleGenAI({
    apiKey:env.GEMINI_API_KEY
});
export const analyseMaintenaceRequest = async(description:string):Promise<MaintenanceAiResult> =>{
    const response  = await ai.models.generateContent({
        model:"gemini-3-flash-preview",
        contents:`
        Analyze this property maintenance request:

"${description}"

Classify the issue and return ONLY valid JSON in this format:

{
  "category": "PLUMBING | ELECTRICAL | HVAC | APPLIANCE | STRUCTURAL | OTHER",
  "priority": "LOW | MEDIUM | HIGH |EMERGENCY",
  "summary": "short summary of the maintenance issue"
}
        `
    })
    
   const text = response.text;
   if(!text){
    throw new Error("Ai returned empty response")
   }
   const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const result: unknown = JSON.parse(cleanText);

    if (
        typeof result !== "object" ||
        result === null ||
        !("category" in result) ||
        !("priority" in result) ||
        !("summary" in result)
    ) {
        throw new Error("AI returned an invalid response structure");
    }

    const { category, priority, summary } = result;

    const validCategories = [
        "PLUMBING",
        "ELECTRICAL",
        "HVAC",
        "APPLIANCE",
        "STRUCTURAL",
        "OTHER",
    ];

    const validPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "EMERGENCY",
    ];

    if (
        typeof category !== "string" ||
        !validCategories.includes(category) ||
        typeof priority !== "string" ||
        !validPriorities.includes(priority) ||
        typeof summary !== "string" ||
        !summary.trim()
    ) {
        throw new Error("AI returned invalid classification values");
    }

    return {
        category: category as MaintenanceAiResult["category"],
        priority: priority as MaintenanceAiResult["priority"],
        summary: summary.trim(),
    };

};

export const gnerateManagerInsights = async (
    requests: ManagerInsightInput[]
): Promise<AIManagerInsights> => {
    const totalRequests = requests.length;

    const emergencyRequests = requests.filter(
        (request) => request.priority === "EMERGENCY"
    ).length;

    const highPriorityRequests = requests.filter(
        (request) => request.priority === "HIGH"
    ).length;

    // Send only relevant maintenance information to Gemini.
    const maintenanceData = requests.map((request) => ({
        title: request.title,
        description: request.description,
        summary: request.aiSummary,
        category: request.category,
        priority: request.priority,
        status: request.status,
        createdAt: request.createdAt,
    }));

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an AI assistant helping a property manager.

Analyze the maintenance data below.

${JSON.stringify(maintenanceData)}

Return ONLY valid JSON in this format:
{
    "insights": "A concise, actionable overview",
    "recommendations": [
        "Specific recommendation",
        "Specific recommendation"
    ]
}

Rules:
- Base every conclusion on the supplied data.
- Identify recurring categories, unresolved issues, and urgent risks
  only when supported by the data.
- Do not invent statistics, events, or maintenance history.
- Recommendations must be practical and actionable.
- If there are no requests, explain that there is insufficient
  maintenance data for meaningful trend analysis.
- Return 1 to 5 recommendations.
        `,
    });

    const text = response.text;

    if (!text) {
        throw new Error("AI returned an empty manager insights response");
    }

    const cleanText = text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    let parsed: unknown;

    try {
        parsed = JSON.parse(cleanText);
    } catch {
        throw new Error("AI returned invalid JSON for manager insights");
    }

    if (!isManagerInsightText(parsed)) {
        throw new Error("AI returned invalid manager insights");
    }

    return {
        totalRequests,
        emergencyRequests,
        highPriorityRequests,
        insights: parsed.insights.trim(),
        recommendations: parsed.recommendations.map(
            (item) => item.trim()
        ),
    };
};