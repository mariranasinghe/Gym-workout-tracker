import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExerciseCard } from "@/components/ExerciseCard";
import { equipmentTypes, exercises, muscleGroups } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";

export default function ExercisesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("all");
  const [equipFilter, setEquipFilter] = useState("all");

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchQuery =
        !query ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(query.toLowerCase());
      const matchMuscle =
        muscleFilter === "all" ||
        e.muscleGroup === muscleFilter ||
        e.secondaryMuscles?.includes(muscleFilter as any);
      const matchEquip = equipFilter === "all" || e.equipment === equipFilter;
      return matchQuery && matchMuscle && matchEquip;
    });
  }, [query, muscleFilter, equipFilter]);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topSection, { paddingTop: topPad }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Exercises
          </Text>
          <View style={[styles.countBadge, { backgroundColor: colors.muted }]}>
            <Text style={[styles.countText, { color: colors.mutedForeground }]}>
              {filtered.length}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises…"
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {muscleGroups.map((mg) => {
            const active = muscleFilter === mg.id;
            return (
              <Pressable
                key={mg.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setMuscleFilter(mg.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? colors.primaryForeground : colors.mutedForeground,
                      fontWeight: active ? "700" : "500",
                    },
                  ]}
                >
                  {mg.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {equipmentTypes.map((eq) => {
            const active = equipFilter === eq.id;
            return (
              <Pressable
                key={eq.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.secondary : colors.card,
                    borderColor: active ? colors.foreground + "40" : colors.border,
                  },
                ]}
                onPress={() => setEquipFilter(eq.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? colors.foreground : colors.mutedForeground,
                      fontWeight: active ? "700" : "500",
                    },
                  ]}
                >
                  {eq.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No exercises found
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  chips: { gap: 7, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  divider: { height: 1 },
  list: { padding: 14 },
  empty: { alignItems: "center", paddingTop: 48, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
