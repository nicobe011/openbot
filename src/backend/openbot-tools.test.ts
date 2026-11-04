import { describe, expect, it } from "vitest";
import { VISIBLE_TOOL_DEFINITIONS } from "./agent/tool-catalog";
import { reportProgressToolSchema } from "./openbot-tools";

describe("report_progress", () => {
  it("accepts one bounded user-facing progress message", () => {
    expect(reportProgressToolSchema.parse({ message: "Checking the browser session now." })).toEqual({
      message: "Checking the browser session now.",
    });
  });

  it("is exposed as a direct built-in tool", () => {
    expect(VISIBLE_TOOL_DEFINITIONS.some((tool) => tool.name === "report_progress")).toBe(true);
    expect(VISIBLE_TOOL_DEFINITIONS.some((tool) => tool.name === "acknowledge_request")).toBe(true);
  });

  it("rejects an empty progress message", () => {
    expect(() => reportProgressToolSchema.parse({ message: "" })).toThrow();
  });
});
