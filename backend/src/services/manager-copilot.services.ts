import Property from "../models/property.models.js";
import Maintaince from "../models/maintenance.model.js";
import mongoose from "mongoose";
import { PropertyHealthService } from "./property-health.services.js";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

export const ManagerCopilotService  =  async(propertyId:string)=>{
    const property = await Property.findById(propertyId);
    if(!property){
        throw new Error("Property not found");
    }
    const maintenanceReq = await Maintaince.find({property:new mongoose.Types.ObjectId(propertyId)});
    console.log(maintenanceReq);    
    const health = await PropertyHealthService(propertyId);
    const maintenaceData = maintenanceReq.map((request) =>({
        category: request.category,
        priority: request.priority,
        status: request.status,
        description: request.description,
        createdAt: request.createdAt
    }));
    console.log("MAINTENANCE DATA:", maintenaceData)
   const prompt = `
You are an AI Property Management Copilot for property managers.

Your job is to analyze the provided property information and maintenance
records and give an accurate, concise, actionable management report.

========================
PROPERTY
========================

Property Name: ${property.name}
Property ID: ${propertyId}

========================
PROPERTY HEALTH
========================

Health Score: ${health.healthScore}/100
Risk Level: ${health.riskLevel}
Total Maintenance Requests: ${health.totalRequests}
High Priority Requests: ${health.highPriorityRequests}
Emergency Requests: ${health.emergencyRequests}
Unresolved Requests: ${health.openRequests}

Health Reasons:
${health.reasons.length > 0
    ? health.reasons.map(reason => `- ${reason}`).join("\n")
    : "- No specific health concerns detected"
}

========================
MAINTENANCE HISTORY
========================

${

    maintenaceData.length > 0
        ? maintenaceData.map((request, index) => `
Request ${index + 1}:
Category: ${request.category}
Priority: ${request.priority}
Status: ${request.status}
Description: ${request.description}
Created At: ${request.createdAt}
`).join("\n")
        : "No maintenance requests found for this property."
}

========================
ANALYSIS RULES
========================

1. ACCURACY
- Use ONLY the information provided above.
- Never invent maintenance issues, causes, dates, or events.
- Do not claim information is missing when it is explicitly provided.
- Do not say the maintenance history is empty when maintenance requests are listed.
- Use the exact priority and status values provided.
- Do not confuse resolved requests with unresolved requests.

2. HEALTH SCORE
- Explicitly mention the Health Score and Risk Level in the Overall Summary.
- Explain the risk level using the actual maintenance statistics.
- Do not calculate a different health score.
- The provided Health Score is the authoritative score.

3. MAINTENANCE ANALYSIS
- Identify the most important maintenance problems.
- Highlight emergency and high-priority requests.
- Identify unresolved requests.
- Identify repeated patterns in categories when supported by the data.
- Distinguish facts from observations.

4. PRIORITIZATION
Prioritize issues in this general order:
EMERGENCY > HIGH > MEDIUM > LOW

However, consider the status and description when explaining priorities.

5. RECOMMENDATIONS
- Give practical actions a property manager can take.
- Prioritize urgent unresolved issues first.
- Recommend preventive actions only when supported by the maintenance history.
- Do not recommend actions based on assumptions.

6. RISK EXPLANATION
- Explain why the property has its current risk level.
- Base the explanation on the provided health score, priority,
  status, category, and maintenance frequency.
- Do not exaggerate potential consequences.
- Do not use words such as "likely", "probably", or "possibly"
  when the data provides a definite answer.

7. MANAGEMENT INSIGHT
Identify useful operational patterns such as:
- High number of unresolved requests
- Repeated maintenance categories
- Emergency issues
- High-priority backlog
- Possible recurring problems
Only mention a pattern when it is actually supported by the data.

========================
RESPONSE FORMAT
========================

Return exactly these sections:

1. Overall Summary
Give a concise overview including:
- Property name
- Health Score
- Risk Level
- Total requests
- Unresolved requests
- Important priority issues

2. Main Problems
List the most important problems supported by the data.

3. Risk Explanation
Explain why the property has its current risk level.

4. Maintenance Patterns
Identify repeated categories, recurring patterns, or unusual
maintenance activity if supported by the provided records.
If no meaningful pattern exists, say so.

5. Recommended Actions
Give specific actions ordered by priority.

6. Most Important Priority
State the single most important issue/action the manager
should address first.

Keep the response professional, concise, and useful for a property manager.

`;
const response =  await ai.models.generateContent({
    model:'gemini-2.5-flash',
    contents:prompt
});
return {
    property:{
        id:propertyId,
        name:property.name,
    },
    health,
    analysis:response.text
}

}