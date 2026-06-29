import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/theme";

export default function FavoriteButton({ isActive, onPress, compact = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.buttonCompact : null,
        isActive ? styles.buttonActive : null,
        pressed ? styles.buttonPressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={isActive ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
    >
      <Text style={[styles.icon, isActive ? styles.iconActive : null]}>{isActive ? "★" : "☆"}</Text>
      {!compact ? <Text style={[styles.label, isActive ? styles.labelActive : null]}>Favoriet</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  buttonCompact: {
    paddingHorizontal: 8,
  },
  buttonActive: {
    borderColor: colors.favorite,
    backgroundColor: "#fff8e8",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  icon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.favorite,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.favorite,
  },
});
