import type { PropertyCopilotResult } from "../types/property-copilot.types";
import {
  parseCopilotAnalysis,
  parseCopilotList,
} from "../utils/copilotParser";

interface CopilotPanelProps {
  copilot: PropertyCopilotResult | null;
  isLoading: boolean;
}

function CopilotPanel({
  copilot,
  isLoading,
}: CopilotPanelProps) {
  if (isLoading) {
    return (
      <section>
        <h2>AI Property Copilot</h2>
        <p>AI is analyzing this property...</p>
      </section>
    );
  }

  if (!copilot) {
    return (
      <section>
        <h2>AI Property Copilot</h2>
        <p>AI analysis unavailable.</p>
      </section>
    );
  }

  const parsed = parseCopilotAnalysis(copilot.analysis);

  const mainProblems = parseCopilotList(
    parsed.mainProblems
  );

  const recommendedActions = parseCopilotList(
    parsed.recommendedActions
  );

  const health = copilot.health;

  return (
    <section>
      <h2>AI Property Copilot</h2>

      {/* Property information */}
      <section>
        <h3>{copilot.property.name}</h3>
      </section>

      {/* Health Overview */}
      <section>
        <h3>Property Health</h3>

        <div>
          <div>
            <h4>Health Score</h4>
            <p>{health.healthScore}/100</p>
          </div>

          <div>
            <h4>Risk Level</h4>
            <p>{health.riskLevel}</p>
          </div>

          <div>
            <h4>Total Requests</h4>
            <p>{health.totalRequests}</p>
          </div>

          <div>
            <h4>Open Requests</h4>
            <p>{health.openRequests}</p>
          </div>

          <div>
            <h4>High Priority</h4>
            <p>{health.highPriorityRequests}</p>
          </div>

          <div>
            <h4>Emergency</h4>
            <p>{health.emergencyRequests}</p>
          </div>
        </div>
      </section>

      {/* Health Reasons */}
      <section>
        <h3>Health Factors</h3>

        {health.reasons.length === 0 ? (
          <p>No health issues detected.</p>
        ) : (
          <ul>
            {health.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Overall Summary */}
      <section>
        <h3>Overall Summary</h3>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
          }}
        >
          {parsed.overallSummary}
        </pre>
      </section>

      {/* Main Problems */}
      <section>
        <h3>Main Problems</h3>

        {mainProblems.length === 0 ? (
          <p>No major problems identified.</p>
        ) : (
          <ul>
            {mainProblems.map((problem, index) => (
              <li key={index}>{problem}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Risk Explanation */}
      <section>
        <h3>Risk Explanation</h3>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
          }}
        >
          {parsed.riskExplanation}
        </pre>
      </section>

      {/* Maintenance Patterns */}
      <section>
        <h3>Maintenance Patterns</h3>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
          }}
        >
          {parsed.maintenancePatterns}
        </pre>
      </section>

      {/* Recommended Actions */}
      <section>
        <h3>Recommended Actions</h3>

        {recommendedActions.length === 0 ? (
          <p>No recommended actions available.</p>
        ) : (
          <ol>
            {recommendedActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ol>
        )}
      </section>

      {/* Most Important Priority */}
      <section>
        <h3>Most Important Priority</h3>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
          }}
        >
          {parsed.mostImportantPriority}
        </pre>
      </section>
    </section>
  );
}

export default CopilotPanel;