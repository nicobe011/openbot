import { describe, expect, it } from "vitest";
import { chatTagReferences, expandChatTagReferences, serializeChatTagReference } from "./chat-tag-references";

describe("OpenBot surface references", () => {
  it("serializes and parses a surface reference", () => {
    const wire = serializeChatTagReference("surface", "Navegador", "browser");
    expect(wire).toBe("@[Navegador](surface:browser)");
    expect(chatTagReferences(wire)).toEqual([
      { kind: "surface", id: "browser", name: "Navegador", start: 0, end: wire.length },
    ]);
  });

  it("expands a browser surface into operational context", () => {
    const wire = serializeChatTagReference("surface", "Navegador", "browser");
    const expanded = expandChatTagReferences(wire);
    expect(expanded).toContain("Navegador (OpenBot surface)");
    expect(expanded).toContain("isolated persistent OpenBot browser");
  });

  it("keeps old agent references unchanged", () => {
    const wire = serializeChatTagReference("agent", "Research", "agent-123");
    expect(expandChatTagReferences(wire)).toBe("@Research");
  });
});
