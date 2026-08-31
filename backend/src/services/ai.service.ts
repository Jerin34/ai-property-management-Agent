import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { MaintenanceAiResult } from "../types/ai.types.js";
import { AIManagerInsights } from "../types/ai-insights.types.js";
const ai = new GoogleGenAI({
    apiKey:env.GEMINI_API_KEY
});
export const analyseMaintenaceRequest = async(description:string):Promise<MaintenanceAiResult> =>{
    const response  = await ai.models.generateContent({
        model:"gemini-2.5-flash",
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

return JSON.parse(cleanText) as MaintenanceAiResult;
};

export const gnerateManagerInsights = async(requests:unknown[]):Promise<AIManagerInsights> => {
    const response =  await ai.models.generateContent({
        model:'gemini-2.5-flash',
        contents:`
        You are an AI assistant for a property manager.

Analyze the following maintenance requests:

${JSON.stringify(requests)}

Return ONLY valid JSON in exactly this format:

{
    "totalRequests": number,
    "emergencyRequests": number,
    "highPriorityRequests": number,
    "insights": "short actionable overview",
    "recommendations": [
        "recommendation 1",
        "recommendation 2"
    ]
}

Rules:
- totalRequests must equal the number of requests provided.
- emergencyRequests must count requests with priority EMERGENCY.
- highPriorityRequests must count requests with priority HIGH.
- Provide practical recommendations based only on the provided requests.
        `

    })
    const text = response.text;
    if(!text){
        throw new Error("Ai returned Empty Response")
    }
       const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
return JSON.parse(cleanText) as AIManagerInsights;

}