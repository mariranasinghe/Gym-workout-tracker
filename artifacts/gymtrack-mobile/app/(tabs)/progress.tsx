import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Alert,
  Platform,
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
import { Workout } from "@/types";

function VolumeChart({ workouts, colors }: { workouts: Workout[]; colors: any }) {
  const last7 = useMemo(() => {
    const days: { label: string; volume: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toISOString().split("T")[0];
      const dayWorkouts = workouts.filter((w) => w.date === dateStr);
      let vol = 0;
      for (const w of dayWorkouts) {
        for (const ex of w.exercises) {
          for (const s of ex.sets) {
            if (s.completed) vol += s.weight * s.reps;
          }
        }
      }
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        volume: vol,
      });
    }
    return days;
  }, [workouts]);

  const maxVol = Math.max(...last7.map((d) => d.volume), 1);

  return (
    <View style={{ gap: 8 }}>
      <View style={chartStyles.bars}>
        {last7.map((day, i) => (
          <View key={i} style={chartStyles.barCol}>
            <View style={chartStyles.barTrack}>
              <View
                style={[
                  chartStyles.barFill,
                  {
                    height: `${(day.volume / maxVol) * 100}%`,
                    backgroundColor:
                      day.volume > 0 ? colors.primary : colors.muted,
                  },
                ]}
              />
            </View>
            <Text style={[chartStyles.barLabel, { color: colors.mutedForeground }]}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 100,
    paddingBottom: 24,
  },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  barTrack: {
    flex: 1,
    width: "70%",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  barFill: { borderRadius: 4, width: "100%" },
  barLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
});

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, deleteWorkout } = useWorkout();
  const { workouts, personalRecords, stats } = state;

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  const handleDeleteWorkout = (id: string, name: string) => {
    Alert.alert("Delete Workout", `Remove "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteWorkout(id),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Progress</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Weekly Volume
        </Text>
        <VolumeChart workouts={workouts} colors={colors} />
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.totalWorkouts}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Workouts
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Streak
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {personalRecords.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            PRs
          </Text>
        </View>
      </View>

      {personalRecords.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Personal Records
          </Text>
          {personalRecords.slice(0, 5).map((pr) => {
            const ex = getExerciseById(pr.exerciseId);
            return (
              <View
                key={pr.exerciseId}
                style={[styles.prRow, { borderColor: colors.border }]}
              >
                <View>
                  <Text style={[styles.prName, { color: colors.foreground }]}>
                    {ex?.name ?? pr.exerciseId}
                  </Text>
                  <Text style={[styles.prDate, { color: colors.mutedForeground }]}>
                    {new Date(pr.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View
                  style={[styles.prBadge, { backgroundColor: colors.primary + "22" }]}
                >
                  <Text style={[styles.prValue, { color: colors.primary }]}>
                    {pr.weight} kg × {pr.reps}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Workout History
        </Text>
        {workouts.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={36} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No workouts logged yet
            </Text>
          </View>
        ) : (
          workouts.slice(0, 10).map((w) => (
            <View key={w.id} style={[styles.historyRow, { borderColor: colors.border }]}>
              <View style={styles.historyLeft}>
                <Text style={[styles.historyName, { color: colors.foreground }]}>
                  {w.name}
                </Text>
                <Text style={[styles.historyMeta, { color: colors.mutedForeground }]}>
                  {new Date(w.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  {w.duration ? ` · ${w.duration} min` : ""}
                  {" · "}{w.exercises.length} exercises
                </Text>
              </View>
              <Pressable
                onPress={() => handleDeleteWorkout(w.id, w.name)}
                hitSlop={8}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  title: { fontSize: 24, fontWeight: "800", fontFamily: "Inter_700Bold" },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 26, fontWeight: "800", fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  prRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  prName: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  prDate: { fontSize: 11, marginTop: 2, fontFamily: "Inter_400Regular" },
  prBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  prValue: { fontSize: 13, fontWeight: "700", fontFamily: "Inter_700Bold" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  historyLeft: { flex: 1, gap: 2 },
  historyName: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  historyMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingVertical: 20, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
