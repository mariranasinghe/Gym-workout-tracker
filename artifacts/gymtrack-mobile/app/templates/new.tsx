import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWorkout } from "@/context/WorkoutContext";
import { exercises as allExercises } from "@/data/exercises";
import { useColors } from "@/hooks/useColors";
import { Exercise } from "@/types";

function genId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

interface SelectedExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
}

export default function NewTemplateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addTemplate } = useWorkout();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = query
    ? allExercises.filter((e) =>
        e.name.toLowerCase().includes(query.toLowerCase())
      )
    : allExercises;

  const handleAddExercise = (ex: Exercise) => {
    if (selected.find((s) => s.exerciseId === ex.id)) return;
    setSelected((prev) => [
      ...prev,
      { exerciseId: ex.id, targetSets: 3, targetReps: "8-12" },
    ]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemove = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.exerciseId !== id));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a template name");
      return;
    }
    if (selected.length === 0) {
      Alert.alert("No exercises", "Add at least one exercise");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTemplate({
      id: genId(),
      name: name.trim(),
      description: description.trim() || undefined,
      exercises: selected,
      isCustom: true,
    });
    router.back();
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
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>
          New Template
        </Text>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            TEMPLATE NAME
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Push Day"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            DESCRIPTION (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Chest, shoulders, triceps"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Exercises ({selected.length})
          </Text>
          <Pressable
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="add" size={16} color={colors.primaryForeground} />
            <Text style={[styles.addBtnText, { color: colors.primaryForeground }]}>Add</Text>
          </Pressable>
        </View>

        {selected.map((sel) => {
          const ex = allExercises.find((e) => e.id === sel.exerciseId);
          return (
            <View
              key={sel.exerciseId}
              style={[styles.exRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.exInfo}>
                <Text style={[styles.exName, { color: colors.foreground }]}>
                  {ex?.name ?? sel.exerciseId}
                </Text>
                <View style={styles.exInputs}>
                  <View style={styles.exField}>
                    <Text style={[styles.exLabel, { color: colors.mutedForeground }]}>Sets</Text>
                    <TextInput
                      style={[styles.exInput, { color: colors.foreground, borderColor: colors.border }]}
                      value={String(sel.targetSets)}
                      onChangeText={(t) =>
                        setSelected((prev) =>
                          prev.map((s) =>
                            s.exerciseId === sel.exerciseId
                              ? { ...s, targetSets: parseInt(t) || 1 }
                              : s
                          )
                        )
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.exField}>
                    <Text style={[styles.exLabel, { color: colors.mutedForeground }]}>Reps</Text>
                    <TextInput
                      style={[styles.exInput, { color: colors.foreground, borderColor: colors.border }]}
                      value={sel.targetReps}
                      onChangeText={(t) =>
                        setSelected((prev) =>
                          prev.map((s) =>
                            s.exerciseId === sel.exerciseId
                              ? { ...s, targetReps: t }
                              : s
                          )
                        )
                      }
                    />
                  </View>
                </View>
              </View>
              <Pressable onPress={() => handleRemove(sel.exerciseId)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={colors.destructive} />
              </Pressable>
            </View>
          );
        })}

        {selected.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="barbell-outline" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No exercises added yet
            </Text>
          </View>
        )}
      </ScrollView>

      {showPicker && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.overlay,
            { backgroundColor: colors.overlay },
          ]}
        >
          <View
            style={[
              styles.picker,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.foreground }]}>
                Select Exercise
              </Text>
              <Pressable onPress={() => setShowPicker(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <View
              style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}
            >
              <Ionicons name="search" size={14} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                value={query}
                onChangeText={setQuery}
                placeholder="Search..."
                placeholderTextColor={colors.mutedForeground}
                autoFocus
              />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(e) => e.id}
              style={{ maxHeight: 360 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isAdded = !!selected.find((s) => s.exerciseId === item.id);
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.pickerItem,
                      { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => handleAddExercise(item)}
                  >
                    <View>
                      <Text style={[styles.pickerName, { color: colors.foreground }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.pickerMeta, { color: colors.mutedForeground }]}>
                        {item.muscleGroup} · {item.equipment}
                      </Text>
                    </View>
                    <Ionicons
                      name={isAdded ? "checkmark-circle" : "add-circle-outline"}
                      size={22}
                      color={isAdded ? colors.success : colors.primary}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topTitle: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  saveText: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 18 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 13, fontWeight: "600" },
  exRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  exInfo: { flex: 1, gap: 8 },
  exName: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  exInputs: { flexDirection: "row", gap: 12 },
  exField: { alignItems: "center", gap: 3 },
  exLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  exInput: {
    width: 52,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
  },
  empty: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  overlay: { alignItems: "center", justifyContent: "flex-end", zIndex: 100 },
  picker: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerTitle: { fontSize: 18, fontWeight: "700", fontFamily: "Inter_700Bold" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pickerName: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  pickerMeta: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
});
