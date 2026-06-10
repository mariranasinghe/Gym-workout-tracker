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

  const topPad =
    Platform.OS === "web" ? insets.top + 67 : insets.top + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topSection,
          { paddingTop: topPad, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Exercises</Text>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises..."
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
          {muscleGroups.map((mg) => (
            <Pressable
              key={mg.id}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    muscleFilter === mg.id ? colors.primary : colors.muted,
                },
              ]}
              onPress={() => setMuscleFilter(mg.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      muscleFilter === mg.id
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {mg.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {equipmentTypes.map((eq) => (
            <Pressable
              key={eq.id}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    equipFilter === eq.id ? colors.secondary : colors.muted,
                  borderWidth: equipFilter === eq.id ? 1 : 0,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setEquipFilter(eq.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      equipFilter === eq.id
                        ? colors.foreground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {eq.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {filtered.length} exercises
        </Text>
      </View>

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
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: "800", fontFamily: "Inter_700Bold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  chips: { gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: "500", fontFamily: "Inter_500Medium" },
  count: { fontSize: 12, fontFamily: "Inter_400Regular" },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
