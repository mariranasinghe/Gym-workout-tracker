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
    .join(", ");

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStart(template.id);
  };

  const handleDelete = () => {
    Alert.alert("Delete Template", `Remove "${template.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTemplate(template.id),
      },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {template.name}
          </Text>
          {template.isCustom && (
            <View style={[styles.customBadge, { backgroundColor: colors.primary + "22" }]}>
              <Text style={[styles.customText, { color: colors.primary }]}>Custom</Text>
            </View>
          )}
        </View>
        {template.isCustom && (
          <Pressable onPress={handleDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={colors.destructive} />
          </Pressable>
        )}
      </View>

      {template.description && (
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {template.description}
        </Text>
      )}

      <Text style={[styles.exercises, { color: colors.mutedForeground }]} numberOfLines={1}>
        {exerciseNames}
        {template.exercises.length > 3 ? ` +${template.exercises.length - 3} more` : ""}
      </Text>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <Ionicons name="barbell-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {template.exercises.length} exercises
          </Text>
          {template.estimatedDuration && (
            <>
              <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                ~{template.estimatedDuration} min
              </Text>
            </>
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
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginBottom: 12,
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
  },
  exercises: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    marginRight: 6,
    fontFamily: "Inter_400Regular",
  },
  startBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
