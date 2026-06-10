import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatCard } from "@/components/StatCard";
import { useWorkout } from "@/context/WorkoutContext";
import { getExerciseById } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, startWorkout } = useWorkout();
  const { stats, activeWorkout, workouts } = state;

  const lastWorkout = workouts[0] ?? null;

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const workoutDays = new Set(
    workouts
      .filter((w) => new Date(w.date) >= startOfWeek)
      .map((w) => new Date(w.date).getDay())
  );

  const handleStartEmpty = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startWorkout("My Workout");
    router.push("/(tabs)/workout");
  };

  const topPad =
    Platform.OS === "web"
      ? insets.top + 67
      : insets.top + 16;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {greeting()}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            GymTrack
          </Text>
        </View>
        <View
          style={[styles.streakBadge, { backgroundColor: colors.primary + "22" }]}
        >
          <Ionicons name="flame" size={18} color={colors.primary} />
          <Text style={[styles.streakNum, { color: colors.primary }]}>
            {stats.currentStreak}
          </Text>
        </View>
      </View>

      {activeWorkout ? (
        <Pressable
          style={({ pressed }) => [
            styles.activeBanner,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() => router.push("/(tabs)/workout")}
        >
          <View style={styles.bannerLeft}>
            <Ionicons name="barbell" size={20} color={colors.primaryForeground} />
            <View>
              <Text style={[styles.bannerTitle, { color: colors.primaryForeground }]}>
                Workout in progress
              </Text>
              <Text style={[styles.bannerSub, { color: colors.primaryForeground + "CC" }]}>
                {activeWorkout.name} · {activeWorkout.exercises.length} exercises
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryForeground} />
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.startBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={handleStartEmpty}
        >
          <Ionicons name="add-circle" size={22} color={colors.primaryForeground} />
          <Text style={[styles.startText, { color: colors.primaryForeground }]}>
            Start Empty Workout
          </Text>
        </Pressable>
      )}

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            This Week
          </Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            {stats.workoutsThisWeek}/{stats.weeklyGoal} goal
          </Text>
        </View>
        <View style={styles.weekRow}>
          {weekDays.map((day, i) => {
            const isToday = i === today.getDay();
            const done = workoutDays.has(i);
            return (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>
                  {day}
                </Text>
                <View
                  style={[
                    styles.dayDot,
                    {
                      backgroundColor: done
                        ? colors.success
                        : isToday
                        ? colors.primary + "44"
                        : colors.muted,
                      borderWidth: isToday ? 2 : 0,
                      borderColor: colors.primary,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.success,
                width: `${Math.min(100, (stats.workoutsThisWeek / stats.weeklyGoal) * 100)}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Workouts" value={stats.totalWorkouts} />
        <StatCard label="Volume" value={formatVolume(stats.totalVolume)} unit="kg" />
      </View>
      <View style={styles.statsGrid}>
        <StatCard label="Streak" value={stats.currentStreak} unit="days" highlight />
        <StatCard label="PRs" value={state.personalRecords.length} />
      </View>

      {lastWorkout && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Last Workout
          </Text>
          <Text style={[styles.lastName, { color: colors.primary }]}>
            {lastWorkout.name}
          </Text>
          <Text style={[styles.lastDate, { color: colors.mutedForeground }]}>
            {new Date(lastWorkout.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
            {lastWorkout.duration ? ` · ${lastWorkout.duration} min` : ""}
          </Text>
          <View style={styles.lastExercises}>
            {lastWorkout.exercises.slice(0, 4).map((we) => {
              const ex = getExerciseById(we.exerciseId);
              const done = we.sets.filter((s) => s.completed).length;
              return (
                <View
                  key={we.id}
                  style={[styles.lastExRow, { borderColor: colors.border }]}
                >
                  <Text style={[styles.lastExName, { color: colors.foreground }]}>
                    {ex?.name ?? we.exerciseId}
                  </Text>
                  <Text style={[styles.lastExSets, { color: colors.mutedForeground }]}>
                    {done} sets
                  </Text>
                </View>
              );
            })}
            {lastWorkout.exercises.length > 4 && (
              <Text style={[styles.more, { color: colors.mutedForeground }]}>
                +{lastWorkout.exercises.length - 4} more
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  title: { fontSize: 28, fontWeight: "800", fontFamily: "Inter_700Bold" },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakNum: { fontSize: 16, fontWeight: "700" },
  activeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
  },
  bannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  bannerSub: { fontSize: 12, marginTop: 2 },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
  },
  startText: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  dayCol: { alignItems: "center", gap: 6 },
  dayLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  dayDot: { width: 28, height: 28, borderRadius: 14 },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  statsGrid: { flexDirection: "row", gap: 12 },
  lastName: { fontSize: 18, fontWeight: "700", fontFamily: "Inter_700Bold" },
  lastDate: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: -4 },
  lastExercises: { gap: 6 },
  lastExRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  lastExName: { fontSize: 14, fontFamily: "Inter_400Regular" },
  lastExSets: { fontSize: 14, fontFamily: "Inter_400Regular" },
  more: { fontSize: 12, fontStyle: "italic", textAlign: "center", marginTop: 4 },
});
