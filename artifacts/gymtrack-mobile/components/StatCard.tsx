import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export function StatCard({ label, value, unit, highlight }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: highlight ? colors.primary + "22" : colors.card,
          borderColor: highlight ? colors.primary + "44" : colors.border,
        },
      ]}
    >
      <Text
        style={[styles.value, { color: highlight ? colors.primary : colors.foreground }]}
        numberOfLines={1}
      >
        {value}
        {unit ? (
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            {" "}
            {unit}
          </Text>
        ) : null}
      </Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  unit: {
    fontSize: 14,
    fontWeight: "400",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
