import type { ConversationMessage, ConversationSubagent } from "@openbot/contracts/ipc";
import { describe, expect, it } from "vitest";
import { projectChatMessages } from "./chat-messages";

const active: ConversationSubagent = {
  id: "worker-1",
  title: "Review browser session",
  agentType: "general-purpose",
  prompt: "Check a page load",
  status: "running",
  startedAt: "2026-11-04T12:00:00.000Z",
  endedAt: null,
  steps: [{ id: "read-1", kind: "web", text: "Opening the page" }],
  error: null,
};

const complete: ConversationSubagent = {
  ...active,
  id: "worker-2",
  title: "Check memory",
  status: "completed",
  endedAt: "2026-11-04T12:01:00.000Z",
  steps: [{ id: "result-2", kind: "text", text: "Memory checked" }],
};

function message(subagents: ConversationSubagent[], text = ""): ConversationMessage {
  return {
    id: "subagents-message",
    turnId: "turn-1",
    author: "assistant",
    text,
    itemType: "subagents",
    status: "streaming",
    createdAt: "2026-11-04T12:00:00.000Z",
    subagents,
  };
}

describe("mobile parallel agents projection", () => {
  it("displays structured subagents even when fallback text is empty", () => {
    expect(projectChatMessages([message([active, complete])])).toEqual([
      {
        id: "subagents-message",
        kind: "subagents",
        subagents: [active, complete],
      },
    ]);
  });

  it("does not create an empty worker card", () => {
    expect(projectChatMessages([message([])])).toEqual([]);
  });

  it("preserves regular agent replies alongside parallel workers", () => {
    const reply: ConversationMessage = {
      id: "reply-1",
      turnId: "turn-1",
      author: "assistant",
      text: "I finished the task.",
      status: "completed",
      createdAt: "2026-11-04T12:01:01.000Z",
    };
    const rows = projectChatMessages([message([complete], "- Check memory"), reply]);
    expect(rows.map((row) => row.kind)).toEqual(["subagents", "message"]);
    expect(rows[1]).toMatchObject({ kind: "message", body: "I finished the task." });
  });
  it("shows committed memory changes as a structured mobile row", () => {
    const memory: ConversationMessage = {
      id: "memory-1",
      turnId: "turn-1",
      author: "system",
      text: "1 memory saved",
      itemType: "memory-changes",
      status: "completed",
      createdAt: "2026-11-04T12:01:02.000Z",
      memoryChanges: [
        {
          memoryId: "memory-a",
          action: "saved",
          text: "The project uses one browser session per agent.",
        },
      ],
    };
    expect(projectChatMessages([memory])).toEqual([
      {
        id: "memory-1",
        kind: "memory-changes",
        changes: memory.memoryChanges,
      },
    ]);
  });
});
