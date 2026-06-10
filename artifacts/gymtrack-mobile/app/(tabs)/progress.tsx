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
        label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
        volume: vol,
      });
    }
    return days;
  }, [workouts]);

  const maxVol = Math.max(...last7.map((d) => d.volume), 1);

  function fmtVol(v: number) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return String(v);
  }

  return (
    <View style={{ gap: 4 }}>
      <View style={chartStyles.bars}>
        {last7.map((day, i) => {
          const pct = day.volume / maxVol;
          const isActive = day.volume > 0;
          return (
            <View key={i} style={chartStyles.barCol}>
              {isActive && (
                <Text style={[chartStyles.volLabel, { color: colors.primary }]}>
                  {fmtVol(day.volume)}
                </Text>
              )}
              <View style={chartStyles.barTrack}>
                <View
                  style={[
                    chartStyles.barFill,
                    {
                      height: `${Math.max(pct * 100, isActive ? 6 : 0)}%`,
                      backgroundColor: isActive ? colors.primary : colors.muted,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  chartStyles.barLabel,
                  { color: isActive ? colors.foreground : colors.mutedForeground },
                ]}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 130,
    paddingBottom: 22,
  },
  barCol: { flex: 1, alignItems: "center", gap: 3 },
  barTrack: {
    flex: 1,
    width: "55%",
    justifyContent: "flex-end",
  },
  barFill: {
    borderRadius: 5,
    width: "100%",
  },
  barLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    fontWeight: "600",
    position: "absolute",
    bottom: 0,
  },
  volLabel: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
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

      {/* Summary strip */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {stats.totalWorkouts}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            Workouts
          </Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            Streak
          </Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {personalRecords.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            PRs
          </Text>
        </View>
      </View>

      {/* Volume Chart */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Weekly Volume
          </Text>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
            Last 7 days
          </Text>
        </View>
        <VolumeChart workouts={workouts} colors={colors} />
      </View>

      {/* Personal Records */}
      {personalRecords.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Personal Records
            </Text>
            <View style={[styles.prCountBadge, { backgroundColor: colors.primary + "22" }]}>
              <Text style={[styles.prCountText, { color: colors.primary }]}>
                {personalRecords.length}
              </Text>
            </View>
          </View>
          {personalRecords.slice(0, 6).map((pr, idx) => {
            const ex = getExerciseById(pr.exerciseId);
            return (
              <View
                key={pr.exerciseId}
                style={[
                  styles.prRow,
                  { borderColor: colors.border },
                  idx === personalRecords.slice(0, 6).length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.prRank, { backgroundColor: colors.muted }]}>
                  <Ionicons name="trophy" size={12} color={colors.primary} />
                </View>
                <View style={styles.prInfo}>
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
                <View style={[styles.prBadge, { backgroundColor: colors.primary + "20" }]}>
                  <Text style={[styles.prValue, { color: colors.primary }]}>
                    {pr.weight}kg × {pr.reps}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Workout History */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Workout History
        </Text>
        {workouts.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Ionicons name="calendar-outline" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No workouts yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Complete a workout to see it here
            </Text>
          </View>
        ) : (
          workouts.slice(0, 10).map((w, idx) => (
            <View
              key={w.id}
              style={[
                styles.historyRow,
                { borderColor: colors.border },
                idx === workouts.slice(0, 10).length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View
                style={[styles.historyDot, { backgroundColor: colors.primary + "30" }]}
              >
                <View style={[styles.historyDotInner, { backgroundColor: colors.primary }]} />
              </View>
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
                  {w.duration ? ` · ${w.duration}m` : ""}
                  {" · "}{w.exercises.length} exercises
                </Text>
              </View>
              <Pressable onPress={() => handleDeleteWorkout(w.id, w.name)} hitSlop={10}>
                <Ionicons name="trash-outline" size={15} color={colors.mutedForeground} />
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
  content: { paddingHorizontal: 16, gap: 12 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  prCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  prCountText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  prRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  prRank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  prInfo: { flex: 1, gap: 2 },
  prName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  prDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  prBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  prValue: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  historyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  historyDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyLeft: { flex: 1, gap: 2 },
  historyName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  historyMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  empty: { alignItems: "center", paddingVertical: 24, gap: 10 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
