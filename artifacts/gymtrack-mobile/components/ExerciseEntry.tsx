import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { SetRow } from "@/components/SetRow";
import { useWorkout } from "@/context/WorkoutContext";
import { getExerciseById } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";
import { WorkoutExercise } from "@/types";

interface ExerciseEntryProps {
  workoutExercise: WorkoutExercise;
}

export function ExerciseEntry({ workoutExercise }: ExerciseEntryProps) {
  const colors = useColors();
  const { addSet, removeExercise } = useWorkout();
  const exercise = getExerciseById(workoutExercise.exerciseId);
  const [collapsed, setCollapsed] = useState(false);

  const handleRemove = () => {
    Alert.alert("Remove Exercise", `Remove ${exercise?.name ?? "this exercise"}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeExercise(workoutExercise.id),
      },
    ]);
  };

  const completedSets = workoutExercise.sets.filter((s) => s.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable
        style={styles.header}
        onPress={() => setCollapsed((c) => !c)}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {exercise?.name ?? workoutExercise.exerciseId}
          </Text>
          <Text style={[styles.progress, { color: colors.mutedForeground }]}>
            {completedSets}/{workoutExercise.sets.length}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={handleRemove} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={colors.mutedForeground} />
          </Pressable>
          <Ionicons
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={18}
            color={colors.mutedForeground}
          />
        </View>
      </Pressable>

      {!collapsed && (
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>SET</Text>
            <Text style={[styles.colLabel, { color: colors.mutedForeground, flex: 1, textAlign: "center" }]}>KG</Text>
            <Text style={[styles.colLabel, { color: colors.mutedForeground, flex: 1, textAlign: "center" }]}>REPS</Text>
            <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>✓</Text>
          </View>

          {workoutExercise.sets.map((set, i) => (
            <SetRow
              key={set.id}
              workoutExerciseId={workoutExercise.id}
              set={set}
              index={i}
              canRemove={workoutExercise.sets.length > 1}
            />
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.addSetBtn,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              addSet(workoutExercise.id);
            }}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text style={[styles.addSetText, { color: colors.primary }]}>Add Set</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  progress: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    width: 20,
    textAlign: "center",
  },
  addSetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addSetText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
