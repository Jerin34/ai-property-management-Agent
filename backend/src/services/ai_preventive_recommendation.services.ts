import { GoogleGenAI } from "@google/genai";
import Property from '../models/property.models.js'
import Maintaince from "../models/maintenance.model.js";
import { AIPreventiveRecommendation  } from  "../types/ai_preventive_recommendation.types.js"
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})
export const getAiPreventiveRecommendations = async(propertyId:string):Promise<AIPreventiveRecommendation> => {
    const property = await Property.findById(propertyId)
    if(!property){
        throw new Error("Property not found")
    }
    const maintenanceRequests = await Maintaince.find({property:propertyId}).sort({createdAt:-1}).limit(30);
    if(maintenanceRequests.length === 0){
        return{
            propertyId,
            recommendations:[]
        };
    }
    const maintenanceHistory = maintenanceRequests.map(request =>({
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: request.status,
        createdAt: request.createdAt
    }));
    console.log("Maintenance History:", maintenanceHistory);
    const prompt = `
    You are an AI property maintenance advisor.

Analyze the maintenance history of this property and identify
useful preventive maintenance actions.

PROPERTY:
Name: ${property.name}
Address: ${JSON.stringify(property.address)}

MAINTENANCE HISTORY:
${JSON.stringify(maintenanceHistory, null, 2)}

Identify:
1. Repeated maintenance problems.
2. Patterns that could indicate future failures.
3. Preventive actions that could reduce future maintenance.
4. Appropriate maintenance frequency.
5. Appropriate preventive priority.

Return ONLY valid JSON in this exact format:

{
    "recommendations": [
        {
            "category": "PLUMBING",
            "issue": "Repeated bathroom water leaks",
            "recommendation": "Inspect bathroom pipes and joints for leakage.",
            "suggestedFrequency": "MONTHLY",
            "priority": "HIGH",
            "reasoning": "The property has experienced repeated plumbing issues."
        }
    ]
}

Rules:
- suggestedFrequency must be DAILY, WEEKLY, MONTHLY, QUARTERLY, or YEARLY.
- priority must be LOW, MEDIUM, or HIGH.
- Do not invent maintenance history.
- Recommendations must be based on the supplied history.
- If there is insufficient evidence for a recommendation, return an empty recommendations array.
- Do not include markdown.
    `
    const response = await ai.models.generateContent({
        model:'gemini-2.5-flash',
        contents:prompt
    });
   const text = response.text?.trim();

console.log("AI Response:", text);

if (!text) {
    throw new Error("AI returned empty response");
}

const cleanedText = text
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

let result;

try {
    result = JSON.parse(cleanedText);
} catch {
    console.error("Invalid JSON from AI:", cleanedText);
    throw new Error("AI returned invalid JSON");
}
    if(!Array.isArray(result.recommendations)){
        throw new Error("Ai returned invalid recommendations");
    }
    return {
        propertyId:property._id.toString(),
        recommendations:result.recommendations
    }
}