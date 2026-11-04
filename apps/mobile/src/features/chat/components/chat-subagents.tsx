import type { ConversationSubagent, ConversationSubagentStatus } from "@openbot/contracts/ipc";
import { Typography } from "heroui-native";
import ChevronDown from "lucide-react-native/icons/chevron-down";
import CircleCheck from "lucide-react-native/icons/circle-check";
import CirclePause from "lucide-react-native/icons/circle-pause";
import CircleX from "lucide-react-native/icons/circle-x";
import LoaderCircle from "lucide-react-native/icons/loader-circle";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { BloubAvatarPreview } from "@/features/agents/components/bloub-avatar";
import type { ChatMessage } from "@/features/chat/model/chat-messages";
import { haptics } from "@/shared/lib/haptics";
import { useReducedMotion } from "@/shared/lib/motion";
import { useText } from "@/shared/lib/text";

type SubagentsMessage = Extract<ChatMessage, { kind: "subagents" }>;

const STATE_KEY = {
  running: "mobile.chat.subagents.state.running",
  completed: "mobile.chat.subagents.state.completed",
  failed: "mobile.chat.subagents.state.failed",
  stopped: "mobile.chat.subagents.state.stopped",
} as const;

function AgentStatusIcon({ status, color }: { status: ConversationSubagentStatus; color: string }) {
  switch (status) {
    case "running":
      return <LoaderCircle size={16} color={color} />;
    case "completed":
      return <CircleCheck size={16} color={color} />;
    case "failed":
      return <CircleX size={16} color={color} />;
    case "stopped":
      return <CirclePause size={16} color={color} />;
  }
}

/**
 * One streamed group of subagents, using the host's existing typed conversation message.
 * No new provider protocol is needed: the same message already drives the desktop card.
 * Only the first four faces animate; long parallel runs keep the mobile list inexpensive.
 */
export function ChatSubagents({ message }: { message: SubagentsMessage }) {
  const { t } = useText();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [primary, muted, border, canvas] = useCSSVariable([
    "--openbot-text-primary",
    "--openbot-text-muted",
    "--openbot-border",
    "--openbot-bg-native-canvas",
  ]);
  const agents = message.subagents;
  const finished = agents.filter((agent) => agent.status !== "running").length;
  const running = agents.some((agent) => agent.status === "running");
  const latest = agents.findLast((agent) => agent.status === "running")?.steps.at(-1)?.text;
  const title = t("mobile.chat.subagents.title");
  const progress = t("mobile.chat.subagents.progress", { finished, total: agents.length });

  return (
    <View
      className="w-full self-stretch overflow-hidden rounded-[14px] border"
      style={{ borderColor: String(border), backgroundColor: String(canvas), borderCurve: "continuous" }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}, ${progress}`}
        onPress={() => {
          void haptics.selection();
          setOpen((current) => !current);
        }}
        className="flex-row items-center gap-3 px-3 py-3"
        style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}
      >
        <View className="flex-row items-center" importantForAccessibility="no-hide-descendants">
          {agents.slice(0, 4).map((agent, index) => (
            <View key={agent.id} style={{ marginLeft: index === 0 ? 0 : -10, zIndex: 4 - index }}>
              <BloubAvatarPreview
                seed={agent.id}
                hue={null}
                size={32}
                mood={
                  agent.status === "running"
                    ? "working"
                    : agent.status === "completed"
                      ? "responded"
                      : agent.status === "stopped"
                        ? "asleep"
                        : "waiting"
                }
                animateIdle={!reducedMotion && agent.status === "running"}
              />
            </View>
          ))}
        </View>
        <View className="min-w-0 flex-1">
          <Typography.Paragraph numberOfLines={1} style={{ color: String(primary) }}>
            {title}
          </Typography.Paragraph>
          <Typography.Paragraph type="body-xs" numberOfLines={1} style={{ color: String(muted) }}>
            {running && latest ? latest : progress}
          </Typography.Paragraph>
        </View>
        <ChevronDown
          size={17}
          color={String(muted)}
          style={{ transform: [{ rotate: open ? "0deg" : "-90deg" }] }}
        />
      </Pressable>
      {open ? (
        <View className="gap-1 px-3 pb-3" accessibilityLabel={title}>
          {agents.map((agent: ConversationSubagent) => {
            const last = agent.steps.at(-1);
            const detail =
              agent.status === "failed" && agent.error ? agent.error : (last?.text ?? agent.prompt);
            return (
              <View key={agent.id} className="flex-row items-start gap-2 rounded-lg px-1 py-2">
                <View className="mt-0.5">
                  <AgentStatusIcon status={agent.status} color={String(muted)} />
                </View>
                <View className="min-w-0 flex-1">
                  <Typography.Paragraph numberOfLines={2} type="body-sm" style={{ color: String(primary) }}>
                    {agent.title || agent.agentType || title}
                  </Typography.Paragraph>
                  {detail ? (
                    <Typography.Paragraph numberOfLines={2} type="body-xs" style={{ color: String(muted) }}>
                      {detail}
                    </Typography.Paragraph>
                  ) : null}
                </View>
                <Typography.Paragraph type="body-xs" style={{ color: String(muted) }}>
                  {t(STATE_KEY[agent.status])}
                </Typography.Paragraph>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
