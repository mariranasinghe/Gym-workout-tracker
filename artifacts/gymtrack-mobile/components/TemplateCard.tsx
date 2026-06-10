import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useWorkout } from "@/context/WorkoutContext";
import { getExerciseById } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";
import { WorkoutTemplate } from "@/types";

interface TemplateCardProps {
  template: WorkoutTemplate;
  onStart: (templateId: string) => void;
}

export function TemplateCard({ template, onStart }: TemplateCardProps) {
  const colors = useColors();
  const { deleteTemplate } = useWorkout();

  const exerciseNames = template.exercises
    .slice(0, 3)
    .map((e) => getExerciseById(e.exerciseId)?.name ?? e.exerciseId)
    .join("  ·  ");

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStart(template.id);
  };

  const handleDelete = () => {
    Alert.alert("Delete Template", `Remove "${template.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTemplate(template.id) },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.accentBar,
          { backgroundColor: template.isCustom ? colors.mutedForeground : colors.primary },
        ]}
      />
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {template.name}
            </Text>
            {template.isCustom && (
              <View style={[styles.customBadge, { backgroundColor: colors.muted }]}>
                <Text style={[styles.customText, { color: colors.mutedForeground }]}>
                  Custom
                </Text>
              </View>
            )}
          </View>
          {template.isCustom && (
            <Pressable onPress={handleDelete} hitSlop={10}>
              <Ionicons name="trash-outline" size={17} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {template.description && (
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {template.description}
          </Text>
        )}

        <Text
          style={[styles.exercises, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {exerciseNames}
          {template.exercises.length > 3 ? `  +${template.exercises.length - 3}` : ""}
        </Text>

        <View style={styles.footer}>
          <View style={styles.meta}>
            <View style={[styles.metaPill, { backgroundColor: colors.muted }]}>
              <Ionicons name="barbell-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {template.exercises.length} exercises
              </Text>
            </View>
            {template.estimatedDuration && (
              <View style={[styles.metaPill, { backgroundColor: colors.muted }]}>
                <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  ~{template.estimatedDuration} min
                </Text>
              </View>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.startBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleStart}
          >
            <Text style={[styles.startText, { color: colors.primaryForeground }]}>
              Start
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  inner: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  customBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customText: {
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  exercises: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  meta: {
    flexDirection: "row",
    gap: 6,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
