import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExerciseEntry } from "@/components/ExerciseEntry";
import { useWorkout } from "@/context/WorkoutContext";
import { exercises } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";
import { Exercise } from "@/types";

function formatDuration(ms: number) {
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function AddExerciseModal({
  onAdd,
  onClose,
}: {
  onAdd: (id: string) => void;
  onClose: () => void;
}) {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const filtered = query
    ? exercises.filter((e) =>
        e.name.toLowerCase().includes(query.toLowerCase())
      )
    : exercises;

  return (
    <View style={[StyleSheet.absoluteFill, styles.modalOverlay, { backgroundColor: colors.overlay }]}>
      <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>
            Add Exercise
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>
        <View
          style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <Text
            style={[styles.searchPlaceholder, { color: colors.mutedForeground }]}
            onPress={() => {}}
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 400 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.exerciseItem,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onAdd(item.id);
                onClose();
              }}
            >
              <View>
                <Text style={[styles.exerciseName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <Text style={[styles.exerciseMeta, { color: colors.mutedForeground }]}>
                  {item.muscleGroup} · {item.equipment}
                </Text>
              </View>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

export default function WorkoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, endWorkout, discardWorkout, addExercise, startWorkout } = useWorkout();
  const { activeWorkout } = state;

  const [elapsed, setElapsed] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeWorkout) {
      const start = new Date(activeWorkout.startTime).getTime();
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - start);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeWorkout?.id]);

  const handleEnd = () => {
    Alert.alert("Finish Workout", "Save this workout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          discardWorkout();
        },
      },
      {
        text: "Save",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          endWorkout();
        },
      },
    ]);
  };

  const topPad =
    Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  if (!activeWorkout) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Ionicons name="barbell-outline" size={60} color={colors.muted} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          No Active Workout
        </Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Start a workout from the Home screen or Templates
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.emptyBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            startWorkout("My Workout");
          }}
        >
          <Ionicons name="add" size={20} color={colors.primaryForeground} />
          <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>
            Start Empty Workout
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(tabs)/templates")}>
          <Text style={[styles.templatesLink, { color: colors.primary }]}>
            Browse Templates
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          { paddingTop: topPad, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View>
          <Text style={[styles.workoutName, { color: colors.foreground }]}>
            {activeWorkout.name}
          </Text>
          <Text style={[styles.timer, { color: colors.primary }]}>
            {formatDuration(elapsed)}
          </Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            style={[styles.topBtn, { backgroundColor: colors.muted }]}
            onPress={() => setShowAdd(true)}
          >
            <Ionicons name="add" size={18} color={colors.foreground} />
            <Text style={[styles.topBtnText, { color: colors.foreground }]}>
              Add
            </Text>
          </Pressable>
          <Pressable
            style={[styles.topBtn, { backgroundColor: colors.primary }]}
            onPress={handleEnd}
          >
            <Text style={[styles.topBtnText, { color: colors.primaryForeground }]}>
              Finish
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={activeWorkout.exercises}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <ExerciseEntry workoutExercise={item} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListEmptyComponent={
          <View style={styles.listEmpty}>
            <Ionicons name="add-circle-outline" size={40} color={colors.muted} />
            <Text style={[styles.listEmptyText, { color: colors.mutedForeground }]}>
              Tap Add to add exercises
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {showAdd && (
        <AddExerciseModal
          onAdd={(id) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            addExercise(id);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  workoutName: { fontSize: 18, fontWeight: "700", fontFamily: "Inter_700Bold" },
  timer: { fontSize: 24, fontWeight: "800", fontFamily: "Inter_700Bold", marginTop: 2 },
  topActions: { flexDirection: "row", gap: 8 },
  topBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  topBtnText: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  listContent: { padding: 16, gap: 0 },
  listEmpty: { alignItems: "center", paddingTop: 60, gap: 12 },
  listEmptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", fontFamily: "Inter_700Bold" },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  emptyBtnText: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  templatesLink: { fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  modalOverlay: {
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalSheet: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", fontFamily: "Inter_700Bold" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchPlaceholder: { fontSize: 14, flex: 1 },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseName: { fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  exerciseMeta: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
});
