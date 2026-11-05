import { describe, expect, it } from "vitest";
import { agentQuickAcknowledgementEnabled, DEFAULT_AGENT_DEFAULTS } from "./ipc-agents";

describe("agent defaults", () => {
  it("shows a plan for long work by default", () => {
    expect(DEFAULT_AGENT_DEFAULTS.quickAcknowledgement).toBe(true);
    expect(agentQuickAcknowledgementEnabled({}, DEFAULT_AGENT_DEFAULTS)).toBe(true);
  });

  it("respects an explicit per-agent opt-out", () => {
    expect(agentQuickAcknowledgementEnabled({ quickAcknowledgement: false }, DEFAULT_AGENT_DEFAULTS)).toBe(false);
  });
});
