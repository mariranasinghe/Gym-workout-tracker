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

type Filter = "all" | "preset" | "custom";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  preset: "Preset",
  custom: "Custom",
};

export default function TemplatesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, startFromTemplate } = useWorkout();

  const [filter, setFilter] = useState<Filter>("all");

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

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Templates
          </Text>
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
            <Ionicons name="add" size={16} color={colors.primaryForeground} />
            <Text style={[styles.newBtnText, { color: colors.primaryForeground }]}>
              New
            </Text>
          </Pressable>
        </View>

        <View style={[styles.filterRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["all", "preset", "custom"] as Filter[]).map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filter === f ? colors.primary : "transparent",
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
                    fontWeight: filter === f ? "700" : "500",
                  },
                ]}
              >
                {FILTER_LABELS[f]}
              </Text>
            </Pressable>
          ))}
        </View>
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
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="clipboard-outline" size={36} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No custom templates
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Create your own routine to get started
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/templates/new" as any)}
            >
              <Ionicons name="add" size={16} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>
                Create Template
              </Text>
            </Pressable>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newBtnText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  filterRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: "center",
  },
  filterText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
