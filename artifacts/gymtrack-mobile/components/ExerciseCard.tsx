import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { Exercise } from "@/types";

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#E8720C",
  back: "#3B82F6",
  shoulders: "#8B5CF6",
  biceps: "#10B981",
  triceps: "#F59E0B",
  legs: "#EC4899",
  glutes: "#EF4444",
  core: "#06B6D4",
  calves: "#84CC16",
  forearms: "#F97316",
};

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
  showArrow?: boolean;
}

export function ExerciseCard({
  exercise,
  onSelect,
  showArrow = true,
}: ExerciseCardProps) {
  const colors = useColors();
  const router = useRouter();
  const muscleColor = MUSCLE_COLORS[exercise.muscleGroup] ?? colors.primary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSelect) {
      onSelect(exercise);
    } else {
      router.push(`/exercise/${exercise.id}` as any);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
      ]}
      onPress={handlePress}
    >
      <View style={[styles.dot, { backgroundColor: muscleColor }]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: muscleColor + "22" }]}>
            <Text style={[styles.tagText, { color: muscleColor }]}>
              {exercise.muscleGroup.charAt(0).toUpperCase() +
                exercise.muscleGroup.slice(1)}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.muted }]}>
            <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
              {exercise.equipment.charAt(0).toUpperCase() +
                exercise.equipment.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  tags: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
});
