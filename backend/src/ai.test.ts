
import { describe, it, expect, vi } from "vitest";
import { analyseMaintenaceRequest } from "./services/ai.service.js";

vi.mock("./services/ai.service.js", () => ({
    analyseMaintenaceRequest: vi.fn(),
}));

describe("AI maintenance classifier", () => {
    it("returns the classified maintenance request", async () => {
        vi.mocked(analyseMaintenaceRequest).mockResolvedValue({
            priority: "LOW",
            category: "OTHER",
            summary: "Minor painting issue",
        } as Awaited<ReturnType<typeof analyseMaintenaceRequest>>);

        const result = await analyseMaintenaceRequest(
            "small issue in painting"
        );

        expect(result.priority).toBe("LOW");
        expect(result.category).toBe("OTHER");
        expect(result.summary).toBe("Minor painting issue");
    });
});
