import { GoogleGenAI } from "@google/genai";
import Maintenance from "../models/maintenance.model.js";
import { MaintenanceCostPrediction } from '../types/maintenance_cost_prediction.types.js'
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})
export const predictMaintenanceCost = async(maintenanceId:string):Promise<MaintenanceCostPrediction> => {
    const maintenance = await Maintenance.findById(maintenanceId);
    if(!maintenance){
        throw new Error("Maintenance request not found")
    }
    const historicalRequest = await Maintenance.find({category:maintenance.category,actualCost:{ $exists:true,$gt:0}}).sort({createdAt:-1}).limit(10);
    const history = historicalRequest.map(request =>({
        category:request.category,
        priority:request.priority,
        description:request.description,
        actualCost:request.actualCost,
    }));
    const prompt = `
    You are a maintenance cost estimation assistant.

Estimate the likely repair cost for the following maintenance request.

CURRENT REQUEST:
Category: ${maintenance.category}
Priority: ${maintenance.priority}
Description: ${maintenance.description}

HISTORICAL MAINTENANCE COSTS:
${JSON.stringify(history, null, 2)}

Return ONLY valid JSON in this exact format:

{
    "predictedCost": 0,
    "confidence": "LOW",
    "reason": "short explanation"
}

Rules:
- predictedCost must be a positive number in INR.
- confidence must be LOW, MEDIUM, or HIGH.
- Use historical costs when available.
- Consider category, priority, and description.
- Do not include markdown.
    `;
const response = await ai.models.generateContent({
    model:'gemini-2.5-flash',
    contents:prompt
})
const text = response.text?.trim();

if(!text){
    throw new Error('Ai returned an Empty response')
}
let result;
try{
    result = JSON.parse(text);
    
}
catch{
    throw new Error('Ai returned invalid json');
}
if(typeof result.predictedCost !== 'number' || !["LOW","MEDIUM","HIGH"].includes(result.confidence) || typeof result.reason !== 'string'){
    throw new Error('Ai returned invalid json');
}
await Maintenance.findByIdAndUpdate(
  maintenanceId,
  {
    estimatedCost: result.predictedCost
  }
);
return {
    maintenanceId:maintenance._id.toString(),
    predictedCost:result.predictedCost,
    confidence:result.confidence,
    reason:result.reason
}
}