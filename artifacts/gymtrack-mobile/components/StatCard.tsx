import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function StatCard({ label, value, unit, highlight, icon }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: highlight ? colors.primary + "18" : colors.card,
          borderColor: highlight ? colors.primary + "50" : colors.border,
          borderTopColor: highlight ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {label}
        </Text>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color={highlight ? colors.primary : colors.mutedForeground}
          />
        )}
      </View>
      <Text
        style={[styles.value, { color: highlight ? colors.primary : colors.foreground }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
        {unit ? (
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            {" "}{unit}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 2,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
