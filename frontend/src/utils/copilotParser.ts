export interface ParsedCopilot{
    overallSummary:string;
    mainProblems:string;
    riskExplanation:string;
    maintenancePatterns: string;
    recommendedActions: string;
    mostImportantPriority: string;
}
export function parseCopilotAnalysis(
  analysis: string
): ParsedCopilot {
  const sections: ParsedCopilot = {
    overallSummary: "",
    mainProblems: "",
    riskExplanation: "",
    maintenancePatterns: "",
    recommendedActions: "",
    mostImportantPriority: "",
  };

  const patterns = [
    {
      key: "overallSummary",
      heading: /(?:\*\*|#+\s*)?1\.\s*Overall Summary:?(?:\*\*)?/i,
    },
    {
      key: "mainProblems",
      heading: /(?:\*\*|#+\s*)?2\.\s*Main Problems:?(?:\*\*)?/i,
    },
    {
      key: "riskExplanation",
      heading: /(?:\*\*|#+\s*)?3\.\s*Risk Explanation:?(?:\*\*)?/i,
    },
    {
      key: "maintenancePatterns",
      heading: /(?:\*\*|#+\s*)?4\.\s*Maintenance Patterns:?(?:\*\*)?/i,
    },
    {
      key: "recommendedActions",
      heading: /(?:\*\*|#+\s*)?5\.\s*Recommended Actions:?(?:\*\*)?/i,
    },
    {
      key: "mostImportantPriority",
      heading: /(?:\*\*|#+\s*)?6\.\s*Most Important Priority:?(?:\*\*)?/i,
    },
  ] as const;

  for (let i = 0; i < patterns.length; i++) {
    const current = patterns[i];

    const startMatch = current.heading.exec(analysis);

    if (!startMatch || startMatch.index === undefined) {
      continue;
    }

    const contentStart =
      startMatch.index + startMatch[0].length;

    const next = patterns[i + 1];

    const endMatch = next
      ? next.heading.exec(analysis.slice(contentStart))
      : null;

    const contentEnd = endMatch
      ? contentStart + endMatch.index
      : analysis.length;

    sections[current.key] = analysis
      .slice(contentStart, contentEnd)
      .replace(/\*\*/g, "")
      .trim();
  }

  return sections;
}
export function parseCopilotList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "")
    );
}