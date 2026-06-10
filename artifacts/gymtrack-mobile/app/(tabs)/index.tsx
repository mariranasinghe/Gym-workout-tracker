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
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
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

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {greeting()}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            GymTrack
          </Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.primary + "20" }]}>
          <Ionicons name="flame" size={16} color={colors.primary} />
          <Text style={[styles.streakNum, { color: colors.primary }]}>
            {stats.currentStreak}
          </Text>
        </View>
      </View>

      {/* CTA */}
      {activeWorkout ? (
        <Pressable
          style={({ pressed }) => [
            styles.activeBanner,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() => router.push("/(tabs)/workout")}
        >
          <View style={styles.bannerLeft}>
            <View style={[styles.bannerIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Ionicons name="barbell" size={18} color={colors.primaryForeground} />
            </View>
            <View>
              <Text style={[styles.bannerTitle, { color: colors.primaryForeground }]}>
                Workout in progress
              </Text>
              <Text style={[styles.bannerSub, { color: colors.primaryForeground + "CC" }]}>
                {activeWorkout.name} · {activeWorkout.exercises.length} exercises
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.primaryForeground} />
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.startBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={handleStartEmpty}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primaryForeground} />
          <Text style={[styles.startText, { color: colors.primaryForeground }]}>
            Start Empty Workout
          </Text>
        </Pressable>
      )}

      {/* This Week */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            This Week
          </Text>
          <Text style={[styles.goalText, { color: colors.mutedForeground }]}>
            {stats.workoutsThisWeek}
            <Text style={{ color: colors.mutedForeground + "88" }}>
              /{stats.weeklyGoal}
            </Text>
          </Text>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day, i) => {
            const isToday = i === today.getDay();
            const done = workoutDays.has(i);
            return (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayLabel, { color: isToday ? colors.primary : colors.mutedForeground }]}>
                  {day}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    {
                      backgroundColor: done
                        ? colors.success
                        : isToday
                        ? colors.primary + "30"
                        : colors.muted,
                      borderWidth: isToday && !done ? 1.5 : 0,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {done && (
                    <Ionicons name="checkmark" size={14} color={colors.successForeground} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.success,
                width: `${Math.min(100, (stats.workoutsThisWeek / stats.weeklyGoal) * 100)}%` as any,
              },
            ]}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Workouts"
          value={stats.totalWorkouts}
          icon="barbell-outline"
        />
        <StatCard
          label="Volume"
          value={formatVolume(stats.totalVolume)}
          unit="kg"
          icon="trending-up-outline"
        />
      </View>
      <View style={styles.statsGrid}>
        <StatCard
          label="Streak"
          value={stats.currentStreak}
          unit="days"
          highlight
          icon="flame-outline"
        />
        <StatCard
          label="PRs"
          value={state.personalRecords.length}
          icon="trophy-outline"
        />
      </View>

      {/* Last Workout */}
      {lastWorkout && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Last Workout
            </Text>
            <Text style={[styles.lastDate, { color: colors.mutedForeground }]}>
              {new Date(lastWorkout.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {lastWorkout.duration ? ` · ${lastWorkout.duration}m` : ""}
            </Text>
          </View>

          <Text style={[styles.lastName, { color: colors.primary }]}>
            {lastWorkout.name}
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
                  <View style={[styles.lastExDot, { backgroundColor: colors.border }]} />
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
                +{lastWorkout.exercises.length - 4} more exercises
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
  content: { paddingHorizontal: 16, gap: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  streakNum: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  activeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  bannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  bannerSub: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
  },
  startText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: { alignItems: "center", gap: 6 },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  statsGrid: { flexDirection: "row", gap: 10 },
  lastName: {
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginTop: -4,
  },
  lastDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  lastExercises: { gap: 2 },
  lastExRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  lastExDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  lastExName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  lastExSets: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  more: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    fontFamily: "Inter_400Regular",
  },
});
