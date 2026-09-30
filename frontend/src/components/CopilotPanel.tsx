import type { PropertyCopilotResult } from "../types/property-copilot.types";
interface CopilotPanelProps{
    copilot:PropertyCopilotResult | null;
}

function CopilotPanel({ copilot }: CopilotPanelProps) {
  return (
    <section>
      <h2>AI Property Copilot</h2>

      {copilot ? (
        <div>
          <h3>AI Analysis</h3>
          <pre
      style={{
        whiteSpace: "pre-wrap",
        fontFamily: "inherit",
      }}
    >
      {copilot.analysis}
    </pre>
        </div>
      ) : (
        <p>No AI Analysis Available</p>
      )}
    </section>
  );
}

export default CopilotPanel