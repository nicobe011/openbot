import { describe, expect, it } from "vitest";
import { agentBrowserProfile } from "./ipc-browser-profiles";

describe("agentBrowserProfile", () => {
  it("uses an isolated agent session when no setting exists", () => {
    expect(agentBrowserProfile({})).toEqual({ kind: "agent" });
  });

  it("keeps an explicit shared-session choice", () => {
    expect(agentBrowserProfile({ ownBrowserSession: false })).toEqual({ kind: "shared" });
  });

  it("gives a named profile precedence over the agent-session setting", () => {
    expect(
      agentBrowserProfile({ ownBrowserSession: false, browserProfileId: "0123456789abcdef0123456789abcdef" }),
    ).toEqual({
      kind: "profile",
      profileId: "0123456789abcdef0123456789abcdef",
    });
  });
});
