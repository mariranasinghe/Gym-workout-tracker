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
        { backgroundColor: set.completed ? colors.success + "12" : "transparent" },
      ]}
    >
      <View
        style={[
          styles.indexBadge,
          {
            backgroundColor: set.completed ? colors.success + "30" : colors.muted,
          },
        ]}
      >
        <Text
          style={[
            styles.index,
            { color: set.completed ? colors.success : colors.mutedForeground },
          ]}
        >
          {index + 1}
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            color: set.completed ? colors.success : colors.foreground,
            backgroundColor: set.completed ? colors.success + "18" : colors.muted,
          },
        ]}
        value={set.weight > 0 ? String(set.weight) : ""}
        onChangeText={(t) =>
          updateSet(workoutExerciseId, set.id, { weight: parseFloat(t) || 0 })
        }
        keyboardType="decimal-pad"
        placeholder="–"
        placeholderTextColor={colors.mutedForeground}
        selectTextOnFocus
      />

      <TextInput
        style={[
          styles.input,
          {
            color: set.completed ? colors.success : colors.foreground,
            backgroundColor: set.completed ? colors.success + "18" : colors.muted,
          },
        ]}
        value={set.reps > 0 ? String(set.reps) : ""}
        onChangeText={(t) =>
          updateSet(workoutExerciseId, set.id, { reps: parseInt(t) || 0 })
        }
        keyboardType="number-pad"
        placeholder="–"
        placeholderTextColor={colors.mutedForeground}
        selectTextOnFocus
      />

      <Pressable
        onPress={toggle}
        style={[
          styles.checkBtn,
          {
            backgroundColor: set.completed ? colors.success : colors.muted,
          },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={16}
          color={set.completed ? colors.successForeground : colors.mutedForeground}
        />
      </Pressable>

      {canRemove ? (
        <Pressable onPress={handleRemove} hitSlop={10} style={styles.removeBtn}>
          <Ionicons name="remove-circle-outline" size={18} color={colors.mutedForeground} />
        </Pressable>
      ) : (
        <View style={styles.removeBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  index: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    width: 24,
    alignItems: "center",
  },
});
