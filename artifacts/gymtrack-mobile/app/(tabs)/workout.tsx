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
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.modalOverlay,
        { backgroundColor: colors.overlay },
      ]}
    >
      <View
        style={[
          styles.modalSheet,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.modalHandle} />
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>
            Add Exercise
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={[styles.closeBtn, { backgroundColor: colors.muted }]}
          >
            <Ionicons name="close" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.muted },
          ]}
        >
          <Ionicons name="search" size={15} color={colors.mutedForeground} />
          <Text
            style={[styles.searchPlaceholder, { color: colors.mutedForeground }]}
          >
            {query || "Search exercises…"}
          </Text>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 380 }}
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
              <View style={styles.exerciseItemLeft}>
                <Text style={[styles.exerciseName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <Text style={[styles.exerciseMeta, { color: colors.mutedForeground }]}>
                  {item.muscleGroup} · {item.equipment}
                </Text>
              </View>
              <View style={[styles.addCircle, { backgroundColor: colors.primary + "22" }]}>
                <Ionicons name="add" size={18} color={colors.primary} />
              </View>
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
  const { state, endWorkout, discardWorkout, addExercise, startWorkout } =
    useWorkout();
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

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  if (!activeWorkout) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: colors.background,
            paddingTop: topPad,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <View style={[styles.emptyIconWrap, { backgroundColor: colors.card }]}>
          <Ionicons name="barbell-outline" size={44} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          No Active Workout
        </Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Log sets, track your volume, and beat your PRs.
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
            Use a Template
          </Text>
        </Pressable>
      </View>
    );
  }

  const completedSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPad,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.timerBlock}>
          <Text style={[styles.workoutName, { color: colors.mutedForeground }]}>
            {activeWorkout.name}
          </Text>
          <Text style={[styles.timer, { color: colors.foreground }]}>
            {formatDuration(elapsed)}
          </Text>
          {totalSets > 0 && (
            <Text style={[styles.setCount, { color: colors.mutedForeground }]}>
              {completedSets}/{totalSets} sets done
            </Text>
          )}
        </View>
        <View style={styles.topActions}>
          <Pressable
            style={[styles.topBtn, { backgroundColor: colors.muted }]}
            onPress={() => setShowAdd(true)}
          >
            <Ionicons name="add" size={17} color={colors.foreground} />
            <Text style={[styles.topBtnText, { color: colors.foreground }]}>
              Add
            </Text>
          </Pressable>
          <Pressable
            style={[styles.topBtn, { backgroundColor: colors.primary }]}
            onPress={handleEnd}
          >
            <Ionicons name="checkmark" size={17} color={colors.primaryForeground} />
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
            <Ionicons
              name="add-circle-outline"
              size={44}
              color={colors.muted}
            />
            <Text style={[styles.listEmptyText, { color: colors.mutedForeground }]}>
              Tap Add to start logging
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  timerBlock: { flex: 1, gap: 1 },
  workoutName: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  setCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  topActions: { flexDirection: "row", gap: 8 },
  topBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  topBtnText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  listContent: { padding: 14, gap: 0 },
  listEmpty: { alignItems: "center", paddingTop: 60, gap: 12 },
  listEmptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
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
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  templatesLink: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  modalOverlay: {
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalSheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    flex: 1,
    fontFamily: "Inter_400Regular",
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseItemLeft: { flex: 1, gap: 2 },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  exerciseMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
