import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { MaintenanceAiResult } from "../types/ai.types.js";
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

