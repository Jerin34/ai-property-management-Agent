import { Request, Response } from "express";

import {
   getAiPreventiveRecommendations 
} from "../services/ai_preventive_recommendation.services.js";

export const getPreventiveRecommendations = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const propertyId = req.params.id.toString();

        const recommendations =
            await getAiPreventiveRecommendations(propertyId);

        res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {

        console.error(
            "AI PREVENTIVE RECOMMENDATION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};