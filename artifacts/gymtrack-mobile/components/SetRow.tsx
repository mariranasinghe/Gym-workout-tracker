import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useWorkout } from "@/context/WorkoutContext";
import { useColors } from "@/hooks/useColors";
import { WorkoutSet } from "@/types";

interface SetRowProps {
  workoutExerciseId: string;
  set: WorkoutSet;
  index: number;
  canRemove: boolean;
}

export function SetRow({ workoutExerciseId, set, index, canRemove }: SetRowProps) {
  const colors = useColors();
  const { updateSet, removeSet } = useWorkout();

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSet(workoutExerciseId, set.id, { completed: !set.completed });
  };

  const handleRemove = () => {
    if (!canRemove) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeSet(workoutExerciseId, set.id);
  };

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: set.completed ? colors.success + "11" : "transparent",
          borderColor: set.completed ? colors.success + "33" : colors.border,
        },
      ]}
    >
      <Text style={[styles.index, { color: colors.mutedForeground }]}>
        {index + 1}
      </Text>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>KG</Text>
        <TextInput
          style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
          value={set.weight > 0 ? String(set.weight) : ""}
          onChangeText={(t) =>
            updateSet(workoutExerciseId, set.id, { weight: parseFloat(t) || 0 })
          }
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
          selectTextOnFocus
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>REPS</Text>
        <TextInput
          style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
          value={set.reps > 0 ? String(set.reps) : ""}
          onChangeText={(t) =>
            updateSet(workoutExerciseId, set.id, { reps: parseInt(t) || 0 })
          }
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
          selectTextOnFocus
        />
      </View>
      <Pressable
        onPress={toggle}
        style={[
          styles.checkBtn,
          {
            backgroundColor: set.completed ? colors.success : colors.muted,
            borderColor: set.completed ? colors.success : colors.border,
          },
        ]}
      >
        <Ionicons
          name={set.completed ? "checkmark" : "checkmark-outline"}
          size={18}
          color={set.completed ? colors.successForeground : colors.mutedForeground}
        />
      </Pressable>
      {canRemove && (
        <Pressable onPress={handleRemove} hitSlop={8}>
          <Ionicons name="remove-circle-outline" size={20} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  index: {
    width: 20,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  field: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    fontFamily: "Inter_600SemiBold",
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
