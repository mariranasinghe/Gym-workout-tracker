import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWorkout } from "@/context/WorkoutContext";
import { getExerciseById } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";

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

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, addExercise } = useWorkout();

  const exercise = getExerciseById(id);
  const pr = state.personalRecords.find((p) => p.exerciseId === id);
  const muscleColor = MUSCLE_COLORS[exercise?.muscleGroup ?? ""] ?? colors.primary;

  if (!exercise) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>
          Exercise not found
        </Text>
      </View>
    );
  }

  const handleAddToWorkout = () => {
    if (!state.activeWorkout) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addExercise(exercise.id);
    router.push("/(tabs)/workout");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 12, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.hero, { backgroundColor: muscleColor + "22", borderColor: muscleColor + "44" }]}
        >
          <Ionicons name="barbell" size={40} color={muscleColor} />
          <View style={styles.heroText}>
            <Text style={[styles.heroName, { color: colors.foreground }]}>
              {exercise.name}
            </Text>
            <View style={styles.heroTags}>
              <View style={[styles.tag, { backgroundColor: muscleColor + "33" }]}>
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
        </View>

        {pr && (
          <View style={[styles.prBox, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" }]}>
            <Ionicons name="trophy" size={18} color={colors.primary} />
            <Text style={[styles.prText, { color: colors.primary }]}>
              PR: {pr.weight} kg × {pr.reps} reps
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Instructions
          </Text>
          {exercise.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumText, { color: colors.primaryForeground }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {exercise.tips && exercise.tips.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Tips
            </Text>
            {exercise.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Secondary Muscles
            </Text>
            <View style={styles.muscleTags}>
              {exercise.secondaryMuscles.map((m) => (
                <View
                  key={m}
                  style={[styles.muscleTag, { backgroundColor: MUSCLE_COLORS[m] + "22" }]}
                >
                  <Text style={[styles.muscleTagText, { color: MUSCLE_COLORS[m] ?? colors.primary }]}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {state.activeWorkout && (
        <View
          style={[
            styles.fab,
            { bottom: insets.bottom + 90, backgroundColor: colors.primary },
          ]}
        >
          <Pressable
            style={({ pressed }) => [styles.fabInner, { opacity: pressed ? 0.85 : 1 }]}
            onPress={handleAddToWorkout}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={[styles.fabText, { color: colors.primaryForeground }]}>
              Add to Workout
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topTitle: { fontSize: 16, fontWeight: "600", flex: 1, textAlign: "center", fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 14 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  heroText: { flex: 1, gap: 6 },
  heroName: { fontSize: 20, fontWeight: "700", fontFamily: "Inter_700Bold" },
  heroTags: { flexDirection: "row", gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  prBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  prText: { fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumText: { fontSize: 12, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" },
  muscleTags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  muscleTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  muscleTagText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  fab: {
    position: "absolute",
    alignSelf: "center",
    borderRadius: 14,
    overflow: "hidden",
  },
  fabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fabText: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
