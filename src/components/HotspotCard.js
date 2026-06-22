import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HotspotCard({ hotspot, onPress }) {
  const isInteractive = typeof onPress === "function";

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [styles.card, isInteractive ? styles.cardInteractive : null, pressed ? styles.cardPressed : null]}
    >
      <Text style={styles.name}>{hotspot.name}</Text>
      <Text style={styles.description}>{hotspot.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Plaats: {hotspot.city}</Text>
        <Text style={styles.metaText}>Sport: {hotspot.sport}</Text>
      </View>
      {isInteractive ? <Text style={styles.tapHint}>Tik om op kaart te tonen</Text> : null}
      <Text style={styles.coords}>
        Coords: {hotspot.lat.toFixed(5)}, {hotspot.lon.toFixed(5)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8e0e8",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  cardInteractive: {
    shadowColor: "#4f657a",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f2f4d",
  },
  description: {
    color: "#30465a",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    color: "#526a80",
    fontWeight: "500",
  },
  tapHint: {
    color: "#1f6fb2",
    fontWeight: "600",
  },
  coords: {
    color: "#7a8a99",
    fontSize: 12,
  },
});
