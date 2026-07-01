import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function Compass({ heading = 0 }) {
  const needleStyle = useMemo(
    () => ({
      transform: [{ rotate: `${heading}deg` }],
    }),
    [heading],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Kompas</Text>
      <View style={styles.compassRing}>
        <Text style={[styles.direction, styles.north]}>N</Text>
        <Text style={[styles.direction, styles.east]}>O</Text>
        <Text style={[styles.direction, styles.south]}>Z</Text>
        <Text style={[styles.direction, styles.west]}>W</Text>
        <View style={[styles.needle, needleStyle]}>
          <View style={styles.needleTop} />
          <View style={styles.needleBottom} />
        </View>
      </View>
      <Text style={styles.value}>{heading}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  compassRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7fbff",
  },
  direction: {
    position: "absolute",
    fontWeight: "800",
    color: colors.text,
  },
  north: {
    top: 8,
  },
  east: {
    right: 10,
  },
  south: {
    bottom: 8,
  },
  west: {
    left: 10,
  },
  needle: {
    position: "absolute",
    width: 18,
    height: 72,
    alignItems: "center",
  },
  needleTop: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.danger,
  },
  needleBottom: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
});