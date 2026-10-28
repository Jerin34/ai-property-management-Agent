import type { MaintenanceAiResult } from "../types/ai.types.js";

export const ClassifyMaintenanceRequest = (
    description: string
): MaintenanceAiResult => {
    const text = description.toLowerCase();

    let category: MaintenanceAiResult["category"] = "OTHER";
    let priority: MaintenanceAiResult["priority"] = "MEDIUM";

    if (
        /\bleak\b|\bleaking\b|\bpipe\b|\bdrain\b|\btoilet\b|\bfaucet\b|\bplumb(?:ing)?\b|\bwater supply\b|\bno water\b|\bwater clog\b|\bpool\b/.test(text)
    ) {
        category = "PLUMBING";
    } else if (
        /\bwire\b|\belectric(?:al|ity)?\b|\bpower outage\b|\bshort circuit\b|\bsocket\b|\bsparking\b|\bbreaker\b/.test(text)
    ) {
        category = "ELECTRICAL";
    } else if (
        /\bair condition(?:er|ing)?\b|\bac\b|\bhvac\b|\bheating\b|\bcooling\b|\bventilation\b/.test(text)
    ) {
        category = "HVAC";
    } else if (
        /\bappliance\b|\brefrigerator\b|\boven\b|\bstove\b|\bdishwasher\b|\bwasher\b|\bdryer\b|\bmicrowave\b|\bfridge\b|\bwashing machine\b/.test(text)
    ) {
        category = "APPLIANCE";
    } else if (
        /\bcrack\b|\bfoundation\b|\bceiling damage\b|\bwall damage\b|\bstructural\b|\bpaint\b|\broof collapse\b/.test(text)
    ) {
        category = "STRUCTURAL";
    }

    if (
        /\bfire\b|\bgas leak\b|\bsmoke\b|\bflooding\b|\belectrocution\b|\bexposed live wire\b/.test(text)
    ) {
        priority = "EMERGENCY";
    } else if (
        /\burgent\b|\bsevere\b|\bmajor leak\b|\bno electricity\b|\bnot working at all\b|\bunsafe\b/.test(text)
    ) {
        priority = "HIGH";
    } else if (
        /\bminor\b|\bsmall\b|\bcosmetic\b|\broutine\b|\bslightly\b/.test(text)
    ) {
        priority = "LOW";
    }

    return {
        category,
        priority,
        summary: description.trim().slice(0, 200),
    };
};