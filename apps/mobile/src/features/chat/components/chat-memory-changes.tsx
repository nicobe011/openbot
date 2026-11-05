import type { ConversationMemoryChange, ConversationMemoryChangeAction } from "@openbot/contracts/ipc";
import type { MobileTextKey } from "@openbot/i18n/mobile";
import { Typography } from "heroui-native";
import Brain from "lucide-react-native/icons/brain";
import ChevronDown from "lucide-react-native/icons/chevron-down";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import type { ChatMessage } from "@/features/chat/model/chat-messages";
import { haptics } from "@/shared/lib/haptics";
import { useText } from "@/shared/lib/text";

type MemoryChangesMessage = Extract<ChatMessage, { kind: "memory-changes" }>;

const ACTION_KEY = {
  saved: "mobile.chat.memory.saved",
  updated: "mobile.chat.memory.updated",
  forgotten: "mobile.chat.memory.forgotten",
  notChanged: "mobile.chat.memory.notChanged",
} as const satisfies Record<ConversationMemoryChangeAction, MobileTextKey>;

function summary(changes: readonly ConversationMemoryChange[]) {
  const counts = { saved: 0, updated: 0, forgotten: 0, notChanged: 0 };
  for (const change of changes) counts[change.action] += 1;
  return counts;
}

/** Shows what the successful turn actually committed to memory. */
export function ChatMemoryChanges({ message }: { message: MemoryChangesMessage }) {
  const { t } = useText();
  const [open, setOpen] = useState(false);
  const [primary, muted, border, canvas] = useCSSVariable([
    "--openbot-text-primary",
    "--openbot-text-muted",
    "--openbot-border",
    "--openbot-bg-native-canvas",
  ]);
  const counts = summary(message.changes);
  const parts = [
    counts.saved ? t("mobile.chat.memory.savedCount", { count: counts.saved }) : null,
    counts.updated ? t("mobile.chat.memory.updatedCount", { count: counts.updated }) : null,
    counts.forgotten ? t("mobile.chat.memory.forgottenCount", { count: counts.forgotten }) : null,
    counts.notChanged ? t("mobile.chat.memory.notChangedCount", { count: counts.notChanged }) : null,
  ].filter((part): part is string => Boolean(part));

  return (
    <View
      className="w-full self-stretch overflow-hidden rounded-[14px] border"
      style={{ borderColor: String(border), backgroundColor: String(canvas), borderCurve: "continuous" }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t("mobile.chat.memory.title")}
        onPress={() => {
          void haptics.selection();
          setOpen((current) => !current);
        }}
        className="flex-row items-center gap-3 px-3 py-3"
        style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}
      >
        <Brain size={18} color={String(muted)} />
        <View className="min-w-0 flex-1">
          <Typography.Paragraph type="body-sm" style={{ color: String(primary) }}>
            {t("mobile.chat.memory.title")}
          </Typography.Paragraph>
          <Typography.Paragraph type="body-xs" numberOfLines={1} style={{ color: String(muted) }}>
            {parts.join(" · ")}
          </Typography.Paragraph>
        </View>
        <ChevronDown size={17} color={String(muted)} style={{ transform: [{ rotate: open ? "0deg" : "-90deg" }] }} />
      </Pressable>
      {open ? (
        <View className="gap-2 px-3 pb-3">
          {message.changes.map((change) => (
            <View key={change.memoryId} className="gap-0.5 rounded-lg px-1 py-1">
              <Typography.Paragraph type="body-xs" style={{ color: String(muted) }}>
                {t(ACTION_KEY[change.action])}
              </Typography.Paragraph>
              <Typography.Paragraph type="body-sm" style={{ color: String(primary) }}>
                {change.text}
              </Typography.Paragraph>
              {change.previousText && change.action === "updated" ? (
                <Typography.Paragraph numberOfLines={2} type="body-xs" style={{ color: String(muted) }}>
                  {t("mobile.chat.memory.previous", { text: change.previousText })}
                </Typography.Paragraph>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
