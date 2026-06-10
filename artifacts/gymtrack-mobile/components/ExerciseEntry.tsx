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
      { text: "Remove", style: "destructive", onPress: () => removeExercise(workoutExercise.id) },
    ]);
  };

  const completedSets = workoutExercise.sets.filter((s) => s.completed).length;
  const totalSets = workoutExercise.sets.length;
  const allDone = completedSets === totalSets && totalSets > 0;
  const progressPct = totalSets > 0 ? completedSets / totalSets : 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.accentBar,
          {
            backgroundColor: allDone
              ? colors.success
              : progressPct > 0
              ? colors.primary
              : colors.border,
          },
        ]}
      />

      <View style={styles.inner}>
        <Pressable style={styles.header} onPress={() => setCollapsed((c) => !c)}>
          <View style={styles.titleBlock}>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {exercise?.name ?? workoutExercise.exerciseId}
            </Text>
            {exercise?.muscleGroup && (
              <Text style={[styles.muscleGroup, { color: colors.mutedForeground }]}>
                {exercise.muscleGroup}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.progressPill,
                {
                  backgroundColor: allDone
                    ? colors.success + "22"
                    : colors.muted,
                },
              ]}
            >
              <Text
                style={[
                  styles.progressText,
                  { color: allDone ? colors.success : colors.mutedForeground },
                ]}
              >
                {completedSets}/{totalSets}
              </Text>
            </View>
            <Pressable onPress={handleRemove} hitSlop={10}>
              <Ionicons name="trash-outline" size={17} color={colors.mutedForeground} />
            </Pressable>
            <Ionicons
              name={collapsed ? "chevron-down" : "chevron-up"}
              size={17}
              color={colors.mutedForeground}
            />
          </View>
        </Pressable>

        {!collapsed && (
          <View style={styles.body}>
            <View style={styles.colHeaders}>
              <View style={styles.colBadge} />
              <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>KG</Text>
              <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>REPS</Text>
              <View style={styles.colCheck} />
              <View style={styles.colRemove} />
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
                {
                  backgroundColor: colors.muted,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addSet(workoutExercise.id);
              }}
            >
              <Ionicons name="add" size={15} color={colors.primary} />
              <Text style={[styles.addSetText, { color: colors.primary }]}>Add Set</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  muscleGroup: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  colHeaders: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  colBadge: { width: 28 },
  colLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    textTransform: "uppercase",
  },
  colCheck: { width: 38 },
  colRemove: { width: 24 },
  addSetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  addSetText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
