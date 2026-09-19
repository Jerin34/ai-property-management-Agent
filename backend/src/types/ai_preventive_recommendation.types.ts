export interface  AIPreventiveRecommendation {
    propertyId: string;
    recommendations: {
        category:string;
        issue:string;
        recommendation:string;
        suggestedFrequency:
            | "DAILY"
            | "WEEKLY"
            | "MONTHLY"
            | "QUARTERLY"
            | "YEARLY";
        priority:"LOW" | "MEDIUM" | "HIGH";
        reasoning:string;
    }[];
}