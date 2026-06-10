import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TemplateCard } from "@/components/TemplateCard";
import { useWorkout } from "@/context/WorkoutContext";
import { useColors } from "@/hooks/useColors";

export default function TemplatesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, startFromTemplate } = useWorkout();

  const [filter, setFilter] = useState<"all" | "preset" | "custom">("all");

  const filtered = state.templates.filter((t) => {
    if (filter === "preset") return !t.isCustom;
    if (filter === "custom") return t.isCustom;
    return true;
  });

  const handleStart = (templateId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startFromTemplate(templateId);
    router.push("/(tabs)/workout");
  };

  const topPad =
    Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Templates</Text>
        <Pressable
          style={({ pressed }) => [
            styles.newBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/templates/new" as any);
          }}
        >
          <Ionicons name="add" size={18} color={colors.primaryForeground} />
          <Text style={[styles.newBtnText, { color: colors.primaryForeground }]}>New</Text>
        </Pressable>
      </View>

      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        {(["all", "preset", "custom"] as const).map((f) => (
          <Pressable
            key={f}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  filter === f ? colors.primary : colors.muted,
              },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === f ? colors.primaryForeground : colors.mutedForeground,
                },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TemplateCard template={item} onStart={handleStart} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No templates yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Create a custom template to get started
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: "800", fontFamily: "Inter_700Bold" },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newBtnText: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  filters: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: { fontSize: 13, fontWeight: "600" },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", fontFamily: "Inter_700Bold" },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});
